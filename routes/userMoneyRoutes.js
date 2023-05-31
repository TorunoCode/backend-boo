import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import UserModal from '../models/userModel.js';
import stringHandle from '../commonFunction/stringHandle.js';
import fileHandle from '../commonFunction/fileHandle.js';
import paypal from 'paypal-rest-sdk';
import billsModel from "../models/billsModel.js"
import orderModel from "../models/orderModel.js";
import showSeatModel from '../models/showSeatModel.js';
import paypalHandle from '../commonFunction/paypalHandle.js';
import moneyHandle from '../commonFunction/moneyHandle.js';
import userFunction from '../routeFunction/user.js';
import payment from '../routeFunction/payment.js';
import timeHandle from '../commonFunction/timeHandle.js';
import queryString from 'query-string';
import crypto from 'crypto';
import user from '../routeFunction/user.js';
const app = express.Router();
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
app.get("/VNPayAdd/:email/:money", async function (req, res) {
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    var tmnCode = process.env.vnp_TmnCode
    var secretKey = process.env.vnp_HashSecret
    var vnpUrl = process.env.vnp_Url
    // 30/5/2023: 1 usd = 23480 vnd
    var amount = Math.round((req.params.money * 23480) * (10 ^ 2)) / (10 ^ 2)
    var amonutUSD = Math.round((req.params.money) * (10 ^ 2)) / (10 ^ 2)
    var returnUrl = req.protocol + "://" + req.get('host') + "/api/userMoney/VNPaySuccess/" + req.params.email
    var date = new Date();
    var createDate = timeHandle.format_yyyymmddHHmmss(date)
    var orderId = timeHandle.format_HHmmss(date);
    var orderInfo = "Nap " + amonutUSD + " vao tai khoan" + req.params.email
    var locale = 'vn'
    var currCode = 'VND';
    var vnp_Params = {
        //VNPay số tiền sẽ trả được gửi dưới dạng số tiền sẽ trả * 100
        'vnp_Amount': amount * 100,
        'vnp_Command': 'pay',
        'vnp_CreateDate': createDate,
        'vnp_CurrCode': currCode,
        'vnp_IpAddr': ipAddr,
        'vnp_Locale': locale,
        'vnp_OrderInfo': orderInfo,
        'vnp_ReturnUrl': returnUrl,
        'vnp_TmnCode': tmnCode,
        'vnp_TxnRef': orderId,
        'vnp_Version': '2.1.0',

    };
    vnp_Params = sortObject(vnp_Params);
    var signData = queryString.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnpUrl += '?' + queryString.stringify(vnp_Params, { encode: false })
        + "&vnp_SecureHash=" + signed;
    return res.redirect(vnpUrl)
});
app.get("/VNPaySuccess/:email", async function (req, res) {
    var vnp_Params = req.query;
    var secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];
    vnp_Params = sortObject(vnp_Params);
    var secretKey = process.env.vnp_HashSecret
    var signData = queryString.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    if (secureHash === signed) {
        if (vnp_Params['vnp_TransactionStatus'] != "00") {
            return res.redirect(req.protocol + "://" + req.get('host') + "/api/userMoney/VNPaySuccessRes/Failed add money")
        }
        let amount = moneyHandle.addMoney(vnp_Params['vnp_Amount'] / 100 / 23480, vnp_Params['vnp_Amount'] / 100 / 23480 * 5 / 100)
        //VND sang USD 2023-05-07: USD = VND * 0.000043
        let result = await userFunction.addMoneyToUser(req.params.email, amount)
        if (!result) {
            return res.redirect(req.protocol + "://" + req.get('host') + "/api/userMoney/VNPaySuccessRes/Can't add money")
        }
        return res.redirect(req.protocol + "://" + req.get('host') + "/api/userMoney/VNPaySuccessRes/Success add money")
    }
    else {
        return res.redirect(req.protocol + "://" + req.get('host') + "/api/userMoney/VNPaySuccessRes/Wrong secureHash")

    }
});
app.get("/VNPaySuccessRes/:message", async function (req, res) {
    let subHtml = fileHandle.template4Notification(req.params.message)
    res.status(400);
    res.write(subHtml);
    res.end();
    return;
});
app.get("/add/:email/:money", async function (req, res) {
    let user = await UserModal.findOne({ email: req.params.email })
    let subHtml
    if (!user) {
        subHtml = fileHandle.template4Notification("Can't find email")
        res.status(400);
        res.write(subHtml);
        res.end();
        return;
    }
    let itemsToAdd = [];
    let moneyAdd = req.params.money;
    moneyAdd = parseFloat(moneyAdd)
    moneyAdd = Number((moneyAdd)).toFixed(2)
    itemsToAdd.push({
        "name": "Add money to account",
        "sku": user.id,
        "price": moneyAdd,
        "currency": "USD",
        "quantity": 1
    })
    let result = await paypalHandle.paypalCreate(
        req.protocol + "://" + req.get('host') + "/api/userMoney/success/" + req.params.email,
        req.protocol + "://" + req.get('host') + "/api/userMoney/cancel",
        itemsToAdd, moneyAdd, "Add money to account")
    try {
        res.redirect(result)
        return;
    }
    catch (error) {
        let subHtml = fileHandle.template3Notification("Can't create payment")
        res.status(400).write(subHtml)
        res.end()
        return
    }
})
app.get('/success/:email', async function (req, res) {
    let subHtml;
    const paymentId = req.query.paymentId;
    let payerId, currency_for_execute, total_for_execute, execute_payment_json;
    paypal.payment.get(paymentId, function (error, payment) {
        if (error) {
            subHtml = fileHandle.template4Notification("Error getting payment")
            res.status(400);
            res.write(subHtml);
            res.end();
            return;
        }
        if (payment.state == "approved") {
            subHtml = fileHandle.template4Notification("Payment doned already")
            res.status(400);
            res.write(subHtml);
            res.end();
            return;
        }
        currency_for_execute = payment.transactions[0].amount.currency;
        total_for_execute = payment.transactions[0].amount.total;
        payerId = req.query.PayerID;
        execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": currency_for_execute,
                    "total": total_for_execute
                }
            }]
        };
        paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
            //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.
            if (error) {
                subHtml = fileHandle.template4Notification("Error paying")
                res.status(400);
                res.write(subHtml);
                res.end();
                return;
            }
            total_for_execute = payment.transactions[0].amount.total; total_for_execute = parseFloat(total_for_execute)
            let amount = moneyHandle.addMoney(total_for_execute, total_for_execute * 5 / 100)
            //VND sang USD 2023-05-07: USD = VND * 0.000043
            await userFunction.addMoneyToUser(req.params.email, amount)
            subHtml = fileHandle.template4Notification("Success add money")
            res.status(200);
            res.write(subHtml);
            res.end();
            return;
        });
    });

});
app.get('/cancel', function (req, res) {
    let subHtml = fileHandle.template4Notification("Cancelled add money")
    res.status(200);
    res.write(subHtml);
    res.end();
    return
});
app.get('/money/:email', async function (req, res) {
    let user = await UserModal.findOne({ email: req.params.email }).select('money');
    if (user)
        return res.status(200).send({ money: user.money })
    else
        return res.status(400).send({ money: 0 })
});
app.post('/pay', async function (req, res) {
    let user = await UserModal.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).send({ message: "Can't find email" })
    }
    const isPasswordCorrect = await stringHandle.compareBcrypt(user.password, req.body.password);
    if (!isPasswordCorrect) {
        return res.status(400).send({ message: "Wrong password" })
    }
    let bill = await billsModel.find({ idCustomer: user.id, status: "-1" });
    if (!bill) {
        return res.status(400).send({ message: "Your bill timeout" })
    }
    let total = bill[0].totalMoney
    total = parseFloat(total)
    let userMoney = parseFloat(user.money)
    userMoney = moneyHandle.subtractionMoney(userMoney, total)
    if (userMoney < 0) {
        return res.status(400).send({ message: "Not enough money in balance" })
    }
    userMoney = "" + userMoney;
    let dateOrder = new Date()
    let sendEmailResult = await payment.sendEmailInvoice(bill[0].id, user.id, total, dateOrder)
    if (!sendEmailResult)
        return res.status(400).send({ message: "Can't send confirm email" })
    user = await UserModal.findOneAndUpdate({ email: req.body.email }, { money: userMoney }, { new: true })
    await billsModel.updateMany({ idCustomer: user.id }, { "$set": { status: "1" } })
    await showSeatModel.updateMany({ idCustomer: user.id }, { "$set": { status: "1" } })
    await orderModel.updateMany({ idCustomer: user.id }, { "$set": { status: "1" } })
    return res.status(200).send({ message: "Payed orders" })
})
/*app.get('/testpaypalpayout/:email/:money', async function (req, res) {
    let user = UserModal.findOne({ email: req.params.email })
    if (!user) {
        return res.status(400).send({ message: "Can't find email" })
    }
    let result = await paypalHandle.paypalPayout(req.params.email, req.params.money)
    if (!result)
        return res.status(400).send({ message: result })
    return res.status(200).send({ message: result.error })

})*/
app.get('/test/addMoney/:money1/:money2', async function (req, res) {
    let addResult = moneyHandle.addMoney(req.params.money1, req.params.money2)
    let subtractResult = moneyHandle.subtractionMoney(req.params.money1, req.params.money2)
    let compareReuslt;
    if (subtractResult < 0)
        compareReuslt = req.params.money1 + " < " + req.params.money2
    else
        compareReuslt = req.params.money1 + " > " + req.params.money2
    return res.send({
        "add": addResult, "sub": subtractResult, "compare": compareReuslt, "vnd to usd": req.params.money1 * 43 / (10 ** 6),
        "mul": req.params.money1 * req.params.money2
    })
})
export default app;