import express, { response } from 'express';
import paypal from 'paypal-rest-sdk';
import transactionsModel from "../models/transactionsModel.js"
import billsModel from "../models/billsModel.js"
import emailProvider from '../config/nodeMailer.js';
import userModel from "../models/userModel.js"
import orderModel from "../models/orderModel.js";
import showSeatModel from '../models/showSeatModel.js';
import CinemaHallSeatModel from '../models/cinemaHallSeatModel.js';
import ShowingModel from '../models/showingModel.js';
import MovieModel from '../models/movieModel.js';
import CinemaHallModel from '../models/cinemaHallModel.js';
import cinemaModel from '../models/cinemaModel.js';
import paypalHandle from '../commonFunction/paypalHandle.js';
import fileHandle from '../commonFunction/fileHandle.js';
import timeHandle from '../commonFunction/timeHandle.js';
import sgMail from '@sendgrid/mail';
import fs from 'fs';
import path from 'path';
import { time } from 'console';
import emailHandle from '../commonFunction/emailHandle.js';
const app = express.Router();
/*app.get("/test/:id", function (req, res) {
  res.send("paypal Routes");
});
app.get("/testssssu/:id", function (req, res) {
  let test = ',a,a'
  if (test.indexOf('a') == -1)
    test = test + 'a'
  test = test.substring(1)
  res.send(test);
});
app.get("/test2/mail", async function (req, res) {
  //sgMail.setApiKey('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')
  try {
    var subHtml = fs.readFileSync(path.join(path.resolve(process.cwd(), "template"), 'mailreceipt3.html'), 'utf8')
    subHtml = subHtml.replace('responseBody', 'test responseBody')
    var mailOptions = {
      from: 'backendtlcn@gmail.com',
      to: 'test@gmail.comxxskd',
      subject: 'Sending Email using Node.js',
      html: subHtml
    };
    var mailOptions = {
      from: 'backendtlcn@gmail.com',
      to: 'test@gmail.comxxskd',
      subject: 'Sending Email using Node.js',
      html: 'test'
    };
    console.log("done to hererrrrrrr 2")
    await new Promise((resolve, reject) => {
      emailProvider.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.status(400).send(error);
          reject(error);
        } else {
          console.log(info)
          resolve(info);
        }
      })
    });
    /*sgMail
      .send(mailOptions)
      .then((response) => {
        console.log(response[0].statusCode)
        console.log(response[0].headers)
      })
      .catch((error) => {
        console.error(error)
      })
    console.log("test here")
    res.write(subHtml);
    res.end();
    res.send();
  }
  catch (error) { return res.send(error) }
  return
});

app.get("/test3", async function (req, res) {
  const paymentId = req.query.paymentId;
  paypal.payment.get(paymentId, async function (error, payment) {
    if (error) {
      subHtml = subHtml.replace('responseBody', "Co loi lay hoa don thanh toan")
      res.status(400);
      res.write(subHtml);
      res.end();
      return;
    } else {
      let paymentInfo = payment;
      let buyer_id = req.params.buyer_id;
      let Name_items = [];
      let Sku_items = [];
      let Currency_items = [];
      let Price_items = [];
      let Quantity_items = [];
      for (let i = 0; i < paymentInfo.transactions[0].item_list.items.length; i++) {
        Name_items[i] = paymentInfo.transactions[0].item_list.items[i].name;
        Sku_items[i] = paymentInfo.transactions[0].item_list.items[i].sku;
        Quantity_items[i] = paymentInfo.transactions[0].item_list.items[i].quantity;
        Currency_items[i] = paymentInfo.transactions[0].item_list.items[i].currency;
        Price_items[i] = paymentInfo.transactions[0].item_list.items[i].price;
      }
      let subHtml = fs.readFileSync(path.join(path.resolve(process.cwd(), "template"), 'mailreceipt2.html'), 'utf8')
      subHtml = subHtml.replace('OrderNumber', paymentId)
      subHtml = subHtml.replace('DateOrder', paymentInfo.update_time.getFullYear + "-" + ("0" + (paymentInfo.update_time.getMonth() + 1)).slice(-2) + '-' + ("0" + paymentInfo.update_time.getDate()).slice(-2))

      let bill = await billsModel.find({ idCustomer: payment.transactions[0].description, status: "-1" });
      //luc chua thanh toan moi nguoi chi co 1 bill
      let billsOfUser = await orderModel.find({ idBill: bill[0]._id });
      console.log(billsOfUser.length)
      console.log(billsOfUser)
      let showing = '';
      let movie = '';
      let CinemaHall = '';
      let Cinema = '';
      let date = '';
      let session = '';
      let seat = '';
      for (let i = 0; i < billsOfUser.length; i++) {
        let showSeat = await showSeatModel.findById(billsOfUser[i].idShowSeat);
        let movietemp;
        let CinemaHalltemp;
        let Cinematemp;
        var datetemp = new Date(showing.startTime),
          mnthtemp = ("0" + (datetemp.getMonth() + 1)).slice(-2),
          daytemp = ("0" + datetemp.getDate()).slice(-2);
        if (session.indexOf(showing.time) == -1)
          session = session + ', ' + showing.time;
        if (date.indexOf([datetemp.getFullYear(), mnthtemp, daytemp].join("-")) == -1)
          date = date + ', ' + [datetemp.getFullYear(), mnthtemp, daytemp].join("-");
        movietemp = await MovieModel.findById(showing.idMovie);
        CinemaHalltemp = await CinemaHallModel.findById(showing.idHall);
        Cinematemp = await cinemaModel.findById(CinemaHall.idCinema);
        if (movie.indexOf(movietemp) == -1)
          movie = movie + ', ' + movietemp;
        if (CinemaHall.indexOf(CinemaHalltemp) == -1)
          CinemaHall = CinemaHall + ', ' + CinemaHalltemp;
        if (Cinema.indexOf(Cinematemp) == -1)
          Cinema = Cinema + ', ' + Cinematemp;
        if (seat.indexOf(showSeat.number) == -1)
          seat = seat + ', ' + showSeat.number
      }
      movie = movie.substring(1);
      subHtml.replace('MovieName', movie);
      Cinema = Cinema.substring(1);
      subHtml.replace('CinemaName', Cinema);
      date = date.substring(1);
      subHtml.replace('DateName', date);
      session = session.substring(1);
      subHtml.replace('SessionName', session);
      seat = seat.substring(1);
      subHtml.replace('SeatName', seat);
      subHtml.replace('SeatQuantity', billsOfUser.length);
      subHtml.replace('SeatQuantityMoney', paymentInfo.transactions[0].amount.details.subTotal)
      subHtml.replace('TotalVatMoney', paymentInfo.transactions[0].amount.details.subTotal)
      var mailOptions = {
        from: 'backendtlcn@gmail.com',
        to: emailToSend[0].email,
        subject: 'Sending Email using Node.js',
        html: subHtml
      };

      await new Promise((resolve, reject) => {
        emailProvider.sendMail(mailOptions, function (error, info) {
          if (error) {
            subHtml = fs.readFileSync(path.join(path.resolve(process.cwd(), "template"), 'mailreceipt3.html'), 'utf8')
            subHtml = subHtml.replace('responseBody', "Khong gui mail thanh cong")
            res.status(400);
            res.write(subHtml);
            res.end();
            reject(err);
          } else {
            console.log(link)
            resolve(info);
          }
        })
      });

      subHtml = fs.readFileSync(path.join(path.resolve(process.cwd(), "template"), 'mailreceipt3.html'), 'utf8')
      subHtml = subHtml.replace('responseBody', "Da Thanh toan va gui xac nhan qua mail xong")
      res.status(400);
      res.write(subHtml);
      res.end();
    }
  });
  /*              const data = await transactionsModel.create({
                  buyer: buyer_id,
                  Fname: paymentInfo.payer.payer_info.first_name,
                  Lname: paymentInfo.payer.payer_info.last_name,
                  recipient_name: paymentInfo.payer.payer_info.shipping_address.recipient_name,
                  Seller: paymentInfo.transactions[0].payee.email,
                  Line1: paymentInfo.payer.payer_info.shipping_address.line1,
                  City: paymentInfo.payer.payer_info.shipping_address.city,
                  postal_code: paymentInfo.payer.payer_info.shipping_address.postal_code,
                  country_code: paymentInfo.payer.payer_info.shipping_address.country_code,
                  Name_items: Name_items,
                  Sku_items: Sku_items,
                  dateCreate: paymentInfo.transactions[0].related_resources[0].sale.create_time,
                  dateUpdate: paymentInfo.transactions[0].related_resources[0].sale.update_time,
                  status: paymentInfo.payer.status,
                  subTotal: paymentInfo.transactions[0].amount.details.subTotal,
                  Fee_payment: paymentInfo.transactions[0].amount.details.handling_fee,
                  Quantity_items: Quantity_items,
                  Currency_items: Currency_items,
                  Price_items: Price_items
                });
});*/
//"payment_method": "pay_upon_invoice"
//"payment_method": "carrier"
//"payment_method": "alternate_payment"
//"payment_method": "bank"
//"payment_method": "paypal"
/*"payment_method": "credit_card",
        "funding_instruments": [
            {
                "payment_card": {
                    "type": "visa",
                    "number": "4669424246660779",
                    "expire_month": "11",
                    "expire_year": "2019",
                    "cvv2": "012",
                    "first_name": "Joe",
                    "billing_country": "US",
                    "last_name": "Shopper"
                }
            }*/
app.get('/pay/:id', async function (req, res) {
  console.log(req.params.id)
  /*  let rand = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      rand += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log(rand);*/
  let total = 0;
  let itemsToAdd = []
  let bill = await billsModel.find({ idCustomer: req.params.id, status: "-1" });
  console.log(bill[0])
  if (!bill[0]) {
    let subHtml = fileHandle.template3Notification("No bills to pay")
    res.status(400).write(subHtml)
    res.end()
    return
  }
  //luc chua thanh toan moi nguoi chi co 1 bill
  let billsOfUser = await orderModel.find({ idBill: bill[0]._id });
  console.log("check orders")
  console.log(billsOfUser)
  for (let i = 0; i < billsOfUser.length; i++) {
    let showSeat;
    let showing;
    let movie;
    let CinemaHall;
    let Cinema;
    try {
      showSeat = await showSeatModel.findById(billsOfUser[i].idShowSeat)
      showing = await ShowingModel.findById(showSeat.idShowing);
      movie = await MovieModel.findById(showing.idMovie);
      CinemaHall = await CinemaHallModel.findById(showing.idHall);
      Cinema = await cinemaModel.findById(CinemaHall.idCinema);
    }
    catch (error) {
      let subHtml = fileHandle.template3Notification("Your movie booked not exist")
      res.status(400).write(subHtml)
      res.end()
      return
    }
    let name = ""
    try {
      var date = timeHandle.formatDate_YearMonthDay(showing.startTime)
      let hourMin = showing.time + "";
      name = showSeat.number + " movie: " + movie.name + " at " + date + " " + hourMin + ", " + CinemaHall.name + ", " + Cinema.name;
    }
    catch (error) {
      let subHtml = fileHandle.template3Notification("Your seat booked not exist")
      res.status(400).write(subHtml)
      res.end()
      return
    }
    console.log(name)
    itemsToAdd.push({
      "name": name,
      "sku": billsOfUser[i]._id,
      "price": showSeat.price,
      "currency": "USD",
      "quantity": 1,
    })
  }
  console.log("check")
  total = bill[0].totalMoney;
  let result = await paypalHandle.paypalCreate(
    req.protocol + "://" + req.get('host') + "/api/paypal/success/" + req.params.id,
    req.protocol + "://" + req.get('host') + "/api/paypal/cancel/" + req.params.id,
    itemsToAdd, total, req.params.id)
  try {
    console.log("done here")
    console.log(result)
    res.redirect(result)
    return;
  }
  catch (error) {
    let subHtml = fileHandle.template3Notification("Can't create payment")
    res.status(400).write(subHtml)
    res.end()
    return
  }

});
/*
app.get('/send_verify/:userId/:rand', async (req, res) => {
  await billsModel.updateMany({ idCustomer: req.params.userId }, { "$set": { status: "1" } })
  await showSeatModel.updateMany({ idCustomer: req.params.buyer_id }, { "$set": { status: "1" } })
  await orderModel.updateMany({ idCustomer: req.params.buyer_id }, { "$set": { status: "1" } })
  let oriUrl = req.originalUrl + '';
  oriUrl = oriUrl.replace('send_verify', 'success')
  var emailToSend = await userModel.find({ _id: req.params.userId }).select('email -_id')
  let link = req.protocol + "://" + req.get('host') + oriUrl
  console.log(emailToSend)
  var subHtml = fs.readFileSync('template/mailreceipt3.html', 'utf8')
  try {
    console.log(emailToSend[0].email)
  }
  catch (error) {
    subHtml = subHtml.replace('responseBody', "Khong tim thay email cua user")
    res.status(400);
    res.write(subHtml);
    res.end();
    //return res.status(400).send("Khong tim thay email cua user")
  }
  subHtml = subHtml.replace('responseBody', "<a href= '" + link + "' target='_blank'>Click here to confirm payment</a>")
  var mailOptions = {
    from: 'backendtlcn@gmail.com',
    to: emailToSend[0].email,
    subject: 'Sending Email using Node.js',
    html: subHtml
  };

  await new Promise((resolve, reject) => {
    emailProvider.sendMail(mailOptions, function (error, info) {
      if (error) {
        subHtml = subHtml.replace('responseBody', "Khong gui mail thanh cong")
        res.status(400);
        res.write(subHtml);
        res.end();
        reject(err);
      } else {
        console.log(link)
        resolve(info);
      }
    })
  });
  subHtml = subHtml.replace('responseBody', "Da Thanh toan xong vui long xem")
  res.status(400);
  res.write(subHtml);
  res.end();
});*/
app.get('/success/:buyer_id', async (req, res) => {
  const paymentId = req.query.paymentId;

  paypal.payment.get(paymentId, function (error, payment) {
    if (error) {
      let subHtml = fileHandle.template3Notification("Can't get bill")
      res.status(400).write(subHtml)
      res.end()
      return
    } else {
      console.log("Get Payment Response");
      if (payment.state == "approved") {
        let subHtml = fileHandle.template3Notification("Bill payed before")
        res.status(400).write(subHtml)
        res.end()
        return

      }
      {
        const payerId = req.query.PayerID;
        const currency_for_execute = payment.transactions[0].amount.currency;
        const total_for_execute = payment.transactions[0].amount.total;
        console.log(payerId)
        const execute_payment_json = {
          "payer_id": payerId,
          "transactions": [{
            "amount": {
              "currency": currency_for_execute,
              "total": total_for_execute
            }
          }]
        };
        // Obtains the transaction details from paypal
        paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
          //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.
          if (error) {
            let subHtml = fileHandle.template3Notification("Error paypal server")
            res.status(400).write(subHtml)
            res.end()
            return
          } else {

            try {
              //luc chua thanh toan moi nguoi chi co 1 bill
              let bill = await billsModel.find({ idCustomer: req.params.buyer_id, status: "-1" })
              console.log(bill)
              let billsOfUser = await orderModel.find({ idBill: bill[0]._id });
              let movie = '';
              let Cinema = '';
              let date = '';
              let session = '';
              let seat = '';
              console.log(billsOfUser)
              console.log("done check")
              for (let i = 0; i < billsOfUser.length; i++) {
                let showSeat = await showSeatModel.findById(billsOfUser[i].idShowSeat);
                console.log("tohere")
                try {
                  let showingtemp;
                  let movietemp;
                  let Cinematemp;
                  showingtemp = await ShowingModel.findById(showSeat.idShowing);
                  movietemp = await MovieModel.findById(showingtemp.idMovie);
                  movietemp = movietemp.name;
                  Cinematemp = await cinemaModel.findById(showingtemp.idCinema);
                  Cinematemp = Cinematemp.name;
                  var datetemp = timeHandle.formatDate_YearMonthDay(showingtemp.startTime)
                  if (session.indexOf(showingtemp.time) == -1)
                    session = session + ', ' + showingtemp.time;
                  if (date.indexOf(datetemp) == -1)
                    date = date + ', ' + datetemp;
                  if (movie.indexOf(movietemp) == -1)
                    movie = movie + ', ' + movietemp;
                  if (Cinema.indexOf(Cinematemp) == -1)
                    Cinema = Cinema + ', ' + Cinematemp;
                  if (seat.indexOf(showSeat.number) == -1)
                    seat = seat + ', ' + showSeat.number
                }
                catch (error) {
                  let subHtml = fileHandle.template3Notification(error)
                  res.status(400).write(subHtml)
                  res.end()
                  return
                }
              }
              console.log("to send email")
              let sendEmailResult = await emailHandle.sendInvoice(
                paymentId, payment, movie, Cinema, date, session, seat,
                billsOfUser, total_for_execute
              )
              if (!sendEmailResult) {
                let subHtml = fileHandle.template3Notification("Can't send email")
                res.status(400).write(subHtml)
                res.end()
                return
              }
              console.log("toherrrrrrrrer")
              await billsModel.updateMany({ idCustomer: req.params.buyer_id }, { "$set": { status: "1" } })
              await showSeatModel.updateMany({ idCustomer: req.params.buyer_id }, { "$set": { status: "1" } })
              await orderModel.updateMany({ idCustomer: req.params.buyer_id }, { "$set": { status: "1" } })
              let subHtml = fileHandle.template3Notification("Done paying and sended invoice to email")
              return res.status(200).write(subHtml)
              /*              const data = await transactionsModel.create({
                              buyer: buyer_id,
                              Fname: paymentInfo.payer.payer_info.first_name,
                              Lname: paymentInfo.payer.payer_info.last_name,
                              recipient_name: paymentInfo.payer.payer_info.shipping_address.recipient_name,
                              Seller: paymentInfo.transactions[0].payee.email,
                              Line1: paymentInfo.payer.payer_info.shipping_address.line1,
                              City: paymentInfo.payer.payer_info.shipping_address.city,
                              postal_code: paymentInfo.payer.payer_info.shipping_address.postal_code,
                              country_code: paymentInfo.payer.payer_info.shipping_address.country_code,
                              Name_items: Name_items,
                              Sku_items: Sku_items,
                              dateCreate: paymentInfo.transactions[0].related_resources[0].sale.create_time,
                              dateUpdate: paymentInfo.transactions[0].related_resources[0].sale.update_time,
                              status: paymentInfo.payer.status,
                              subTotal: paymentInfo.transactions[0].amount.details.subTotal,
                              Fee_payment: paymentInfo.transactions[0].amount.details.handling_fee,
                              Quantity_items: Quantity_items,
                              Currency_items: Currency_items,
                              Price_items: Price_items
                            });*/
            } catch (error) {
              let subHtml = fileHandle.template3Notification(error)
              res.status(400).write(subHtml)
              res.end()
              return
            }
          }
        });
      }
    }
  });
});

/*app.post("/delete_transactions", async (request, response) => {
  const transaction = new transactionsModel(request.body);

  try {
    await transaction.deleteOne({ _id: transaction['_id'] });
    response.send({ message: 'done delete transaction' });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/get_payment/:user_id/:id", async (request, response) => {
  const user_id = request.params.user_id;
  const id = request.params.id;
  const transaction = (await transactionsModel.find({ buyer: user_id, _id: id }));
  try {
    response.send(transaction);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/old_payments/:user_id/:page", async (request, response) => {
  const user_id = request.params.user_id;
  const page = request.params.page;
  const transaction = (await transactionsModel.find({ buyer: user_id }).sort({ "updatedAt": -1 }).skip(1 * page * 10).limit(10));
  const count = await transactionsModel.count({ buyer: user_id });
  const numpage = Math.ceil(count / 10);
  console.log("user id " + user_id + " num transactions: " + count)
  const allTransactionOfUser = { number_of_transaction: count, _number_of_page: numpage };
  transaction.push(allTransactionOfUser);
  try {
    response.send(transaction);
  } catch (error) {
    response.status(500).send(error);
  }
});
app.post("/delete_allTransaction", async (request, response) => {

  try {
    await transactionsModel.deleteMany({});
    console.log('to delete all transactions');
    response.send({ message: 'done delete all transactions' });
  } catch (error) {
    response.status(500).send(error);
  }
});*/
app.get('/cancel/:user_id', async (req, res) => {
  console.log('to delete all transactions');

  const check = await orderModel.findOne({ idCustomer: req.params.id, status: -1 });   //lay bill hien tai 
  await showSeatModel.findById(check.idShowing).updateOne({}, { $set: { isReserved: false } }); //cap nhat trang thai ve tro lai trang thai ban dau
  await billsModel.findByIdAndDelete({ idCustomer: req.params.user_id, status: -1 });    //xoa  totalbill       
  await orderModel.findByIdAndDelete({ idCustomer: req.params.user_id, status: -1 });    //xoa order       

  res.send({ message: 'Cancelled' })

});
export default app;