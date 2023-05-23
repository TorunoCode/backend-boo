import express, { response } from 'express';
import paypal from 'paypal-rest-sdk';
import transactionsModel from "../models/transactionsModel.js"
import billModel from "../models/billsModel.js"
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
import paymentFunction from '../routeFunction/payment.js';
const app = express.Router();
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
  let total = 0;
  let itemsToAdd = []
  let bill = await billModel.find({ idCustomer: req.params.id, status: "-1" });
  if (!bill[0]) {
    let subHtml = fileHandle.template3Notification("No bills to pay")
    res.status(400).write(subHtml)
    res.end()
    return
  }
  //luc chua thanh toan moi nguoi chi co 1 bill
  let billsOfUser = await orderModel.find({ idBill: bill[0]._id });
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
      CinemaHall = await CinemaHallModel.findById(showing.idHall)
      Cinema = await cinemaModel.findById(showing.idCinema);
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
      name = showSeat.number + " movie: " + movie.name + " at " + date + " " + hourMin + "; " + CinemaHall.name + ", " + Cinema.name;
    }
    catch (error) {
      let subHtml = fileHandle.template3Notification("Your seat booked not exist")
      res.status(400).write(subHtml)
      res.end()
      return
    }
    itemsToAdd.push({
      "name": name,
      "sku": billsOfUser[i]._id,
      "price": showSeat.price,
      "currency": "USD",
      "quantity": 1,
    })
  }
  total = bill[0].totalMoney;
  let result = await paypalHandle.paypalCreate(
    req.protocol + "://" + req.get('host') + "/api/paypal/success/" + req.params.id + "/" + bill[0]._id,
    req.protocol + "://" + req.get('host') + "/api/paypal/cancel/" + req.params.id,
    itemsToAdd, total, req.params.id)
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

});
app.get('/success/:buyer_id/:bill_id', async function (req, res) {
  const paymentId = req.query.paymentId;

  paypal.payment.get(paymentId, function (error, payment) {
    if (error) {
      let subHtml = fileHandle.template3Notification("Can't get bill")
      res.status(400).write(subHtml)
      res.end()
      return
    } else {
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
              let dateOrder = new Date()
              let sendEmailResult = await paymentFunction.sendEmailInvoice(req.params.bill_id, req.params.buyer_id, total_for_execute, dateOrder)
              if (!sendEmailResult)
                return res.status(400).send({ message: "Can't send confirm email" })
              await billModel.updateMany({ idCustomer: req.params.buyer_id }, { "$set": { status: "1" } })
              await showSeatModel.updateMany({ idCustomer: req.params.buyer_id }, { "$set": { status: "1" } })
              await orderModel.updateMany({ idCustomer: req.params.buyer_id }, { "$set": { status: "1" } })
              let subHtml = fileHandle.template3Notification("Done paying and sended invoice to email")
              res.status(200).write(subHtml)
              res.end()
              return
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

app.get('/cancel/:id', async function (req, res) {
  try {
    const check = await billModel.findOne({ idCustomer: req.params.id, status: "-1" });   //lay bill hien tai 
    const listCheck = await orderModel.distinct('idShowSeat', { idCustomer: req.params.id, status: "-1" });
    for (let a of listCheck) {
      await showSeatModel.findByIdAndUpdate(a, { $set: { isReserved: false } });
    }
    await orderModel.deleteMany({ idBill: check._id.toString() });
    await billModel.findByIdAndRemove(check._id.toString());
    let subHtml = fileHandle.template3Notification('Cancelled')
    res.status(400).write(subHtml)
    res.end()
    return
  }
  catch (error) {
    let subHtml = fileHandle.template3Notification("Something went wrong")
    res.status(400).write(subHtml)
    res.end()
    return
  }
});
export default app;