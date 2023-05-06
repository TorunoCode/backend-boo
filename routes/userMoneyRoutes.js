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
const app = express.Router();
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
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": req.protocol + "://" + req.get('host') + "/api/userMoney/success/" + req.params.email,
            "cancel_url": req.protocol + "://" + req.get('host') + "/api/userMoney/cancel"
        },
        "transactions": [{
            "item_list": {
                //tra mot luc nhieu ve
                //sku lay theo id
                //status = 0: trong qua trinh tra; status = 1: thanh toan roi; status=-1: chua tra
                // lay status = -1 xu ly roi gan = 0
                "items": itemsToAdd
            },
            "amount": {
                "currency": "USD",
                "total": moneyAdd
            }
        }]
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            res.status(400).send(error);
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    console.log(payment.links[i].href)
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
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
            let user = await UserModal.findOne({ email: req.params.email })
            let userMoney
            if (user.money == null)
                userMoney = parseFloat(0)
            else userMoney = parseFloat(user.money)
            userMoney = moneyHandle.addMoney(userMoney, total_for_execute);
            userMoney = userMoney.toString();
            user = await UserModal.findOneAndUpdate({ email: req.params.email }, { money: userMoney }, { new: true });
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
    console.log(user)
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
        return res.status(400).send({ message: "No bill to pay" })
    }
    let total = bill[0].totalMoney
    total = parseFloat(total)
    let userMoney = parseFloat(user.money)
    console.log(total)
    console.log(userMoney)
    console.log(user)
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
    console.log(await
        userFunction.addMoneyToUser("testEmailAccccc1234@gmail.com", 100))
    if (subtractResult < 0)
        compareReuslt = req.params.money1 + " < " + req.params.money2
    else
        compareReuslt = req.params.money1 + " > " + req.params.money2
    return res.send({ "add": addResult, "sub": subtractResult, "compare": compareReuslt })
})
export default app;