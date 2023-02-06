import express from 'express';
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
import sgMail from '@sendgrid/mail';
import fs from 'fs';
const app = express.Router();
app.get("/test/:id", function (req, res) {
  res.send("paypal Routes");
});
app.get("/test2/mail", async function (req, res) {
  //sgMail.setApiKey('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')
  var subHtml = fs.readFileSync('template/mailreceipt3.html', 'utf8')
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
        //console.log(error)
        //let subHtml = fs.readFileSync('template/mailreceipt3.html', 'utf8')
        //subHtml = subHtml.replace('responseBody', "Khong gui mail thanh cong")
        //res.status(400);
        //res.write(subHtml);
        reject(error);
      } else {
        console.log(link)
        resolve(info);
      }
    })
  });
  /*await new Promise((resolve, reject) => {
    emailProvider.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(400).send(error);
        reject(error);
      } else {
        console.log(info)
        resolve(info);
      }
    })
  });*/
  /*sgMail
    .send(mailOptions)
    .then((response) => {
      console.log(response[0].statusCode)
      console.log(response[0].headers)
    })
    .catch((error) => {
      console.error(error)
    })*/
  console.log("test here")
  res.write(subHtml);
  res.end();
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
      let subHtml = fs.readFileSync('template/mailreceipt2.html', 'utf8')
      subHtml = subHtml.replace('OrderNumber', paymentId)
      subHtml = subHtml.replace('DateOrder', paymentInfo.update_time)

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
        session = session + ', ' + showing.time;
        date = date + ', ' + [datetemp.getFullYear(), mnthtemp, daytemp].join("-");
        movietemp = await MovieModel.findById(showing.idMovie);
        CinemaHalltemp = await CinemaHallModel.findById(showing.idHall);
        Cinematemp = await cinemaModel.findById(CinemaHall.idCinema);
        movie = movie + ', ' + movietemp;
        CinemaHall = CinemaHall + ', ' + CinemaHalltemp;
        Cinema = Cinema + ', ' + Cinematemp;
        seat = seat + ', ' + showSeat.number
      }

      subHtml.replace('MovieName', movie);
      subHtml.replace('CinemaName', Cinema);
      subHtml.replace('DateName', date);
      subHtml.replace('SessionName', session);
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
            subHtml = fs.readFileSync('template/mailreceipt3.html', 'utf8')
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

      subHtml = fs.readFileSync('template/mailreceipt3.html', 'utf8')
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
                });*/
});
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
app.get('/pay/:id', async (req, res) => {
  /*  let rand = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      rand += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log(rand);*/
  let total = 0;
  let itemsToAdd = []
  let countStatusChecking = await billsModel.count({ idCustomer: req.params.id, status: "0" });
  if (countStatusChecking > 0) {
    res.status(400).send("confirm old payment first");
  }
  else {
    let countStatusChecking2 = await billsModel.count({ idCustomer: req.params.id, status: "-1" });
    if (countStatusChecking2 == 0) {
      return res.status(400).send("no bills to pay");
    }
    let bill = await billsModel.find({ idCustomer: req.params.id, status: "-1" });
    //luc chua thanh toan moi nguoi chi co 1 bill
    let billsOfUser = await orderModel.find({ idBill: bill[0]._id });
    for (let i = 0; i < billsOfUser.length; i++) {
      let showSeat = await showSeatModel.findById(billsOfUser[i].idShowSeat);
      let CinemaHallSeat = await CinemaHallSeatModel.find({ _id: showSeat.idCinemaHallSeat });
      let showing;
      let movie;
      let CinemaHall;
      let Cinema;
      try {
        showing = await ShowingModel.findById(showSeat.idShowing);
        movie = await MovieModel.findById(showing.idMovie);
        CinemaHall = await CinemaHallModel.findById(showing.idHall);
        Cinema = await cinemaModel.findById(CinemaHall.idCinema);
      }
      catch (error) { return res.status(500).send({ message: "Your movie booked not exist" }) }
      let name = ""
      let descriptionItems = ""
      console.log()
      try {
        var date = new Date(showing.startTime),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        let hourMin = "";
        console.log(showing.time)
        hourMin = showing.time;
        name = showSeat.number + " movie: " + movie.name + " at " + [date.getFullYear(), mnth, day].join("-") + " " + hourMin + ", " + CinemaHall.name + ", " + Cinema.name;
        descriptionItems = "start at: " + showing.startTime + ", Cinemal Hall name: " + CinemaHall.name + ", Cinema name: " + Cinema.name + ", Location: " + Cinema.location
      }
      catch (error) { return res.status(500).send({ message: "Your seat booked not exist" }) }
      console.log(name)
      itemsToAdd.push({
        "name": name,
        "sku": billsOfUser[i]._id,
        "price": showSeat.price,
        "currency": "USD",
        "quantity": 1,
        "description": descriptionItems
      })
    }
    total = bill[0].totalMoney;
    const create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": req.protocol + "://" + req.get('host') + "/api/paypal/success/" + req.params.id,
        "cancel_url": req.protocol + "://" + req.get('host') + "/api/paypal/cancel"
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
          "total": total
        },
        "description": req.params.id
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
  var subHtml = fs.readFileSync('template/mailreceipt3.html', 'utf8')
  const paymentId = req.query.paymentId;
  paypal.payment.get(paymentId, function (error, payment) {
    if (error) {
      subHtml = subHtml.replace('responseBody', "Co loi lay hoa don thanh toan")
      res.status(400);
      res.write(subHtml);
      res.end();
      return;
    } else {
      console.log("Get Payment Response");
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
        if (payment.state == "approved") {
          subHtml = subHtml.replace('responseBody', "Ban da tra cho hoa don nay")
          res.status(400);
          res.write(subHtml);
          res.end();
          return;
        }
        let paymentInfo;
        // Obtains the transaction details from paypal
        paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
          //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.
          if (error) {
            subHtml = subHtml.replace('responseBody', "co loi giao dich")
            res.status(400);
            res.write(subHtml);
            res.end();
            return;
          } else {
            paymentInfo = payment;
            let buyer_id = req.params.buyer_id;
            let Name_items = [];
            let Sku_items = [];
            let Currency_items = [];
            let Price_items = [];
            let Quantity_items = [];
            try {
              for (let i = 0; i < paymentInfo.transactions[0].item_list.items.length; i++) {
                Name_items[i] = paymentInfo.transactions[0].item_list.items[i].name;
                Sku_items[i] = paymentInfo.transactions[0].item_list.items[i].sku;
                Quantity_items[i] = paymentInfo.transactions[0].item_list.items[i].quantity;
                Currency_items[i] = paymentInfo.transactions[0].item_list.items[i].currency;
                Price_items[i] = paymentInfo.transactions[0].item_list.items[i].price;
              }
              subHtml = fs.readFileSync('template/mailreceipt2.html', 'utf8')
              subHtml = subHtml.replace('OrderNumber', paymentId)
              subHtml = subHtml.replace('DateOrder', paymentInfo.transactions[0].related_resources[0].sale.update_time)
              let bill = await billsModel.find({ idCustomer: payment.transactions[0].description, status: "-1" });
              //luc chua thanh toan moi nguoi chi co 1 bill
              let billsOfUser = await orderModel.find({ idBill: bill[0]._id });
              let movie = '';
              let Cinema = '';
              let date = '';
              let session = '';
              let seat = '';
              for (let i = 0; i < billsOfUser.length; i++) {
                let showSeat = await showSeatModel.findById(billsOfUser[i].idShowSeat);
                let CinemaHallSeat = await CinemaHallSeatModel.find({ _id: showSeat.idCinemaHallSeat });
                console.log("tohere")
                try {
                  let showingtemp;
                  let movietemp;
                  let CinemaHalltemp;
                  let Cinematemp;
                  showingtemp = await ShowingModel.findById(showSeat.idShowing);
                  movietemp = await MovieModel.findById(showingtemp.idMovie);
                  movietemp = movietemp.name;
                  CinemaHalltemp = await CinemaHallModel.findById(showingtemp.idHall);
                  Cinematemp = await cinemaModel.findById(CinemaHalltemp.idCinema);
                  Cinematemp = Cinematemp.name;
                  var datetemp = new Date(showingtemp.startTime),
                    mnthtemp = ("0" + (datetemp.getMonth() + 1)).slice(-2),
                    daytemp = ("0" + datetemp.getDate()).slice(-2);
                  session = session + ', ' + showingtemp.time;
                  date = date + ', ' + [datetemp.getFullYear(), mnthtemp, daytemp].join("-");
                  movie = movie + ', ' + movietemp;
                  Cinema = Cinema + ', ' + Cinematemp;
                  seat = seat + ', ' + showSeat.number
                }
                catch (error) { return res.status(500).send(error) }
              }
              console.log(movie)
              subHtml = subHtml.replace('MovieName', '' + movie + '');
              console.log(Cinema)
              subHtml = subHtml.replace('CinemaName', '' + Cinema + '');
              console.log(date)
              subHtml = subHtml.replace('DateName', '' + date + '');
              console.log(session)
              subHtml = subHtml.replace('SessionName', '' + session + '');
              console.log(seat)
              subHtml = subHtml.replace('SeatName', '' + seat + '');
              console.log(billsOfUser.length)
              subHtml = subHtml.replace('SeatQuantity', '' + billsOfUser.length + '');
              console.log(total_for_execute)
              subHtml = subHtml.replace('SeatQuantityMoney', '' + total_for_execute + '')
              subHtml = subHtml.replace('TotalVatMoney', '' + total_for_execute + '')
              console.log("done to hererrrrrrr")
              var emailToSend = await userModel.find({ _id: payment.transactions[0].description }).select('email -_id')
              var mailOptions = {
                from: 'backendtlcn@gmail.com',
                to: emailToSend[0].email,
                subject: 'Sending Email using Node.js',
                html: subHtml
              };
              console.log(emailToSend)
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
              console.log("toherrrrrrrrer")
              await billsModel.updateMany({ idCustomer: payment.transactions[0].description }, { "$set": { status: "1" } })
              await showSeatModel.updateMany({ idCustomer: payment.transactions[0].description }, { "$set": { status: "1" } })
              await orderModel.updateMany({ idCustomer: payment.transactions[0].description }, { "$set": { status: "1" } })
              subHtml = fs.readFileSync('template/mailreceipt3.html', 'utf8')
              subHtml = subHtml.replace('responseBody', "Da Thanh toan va gui xac nhan qua mail xong")
              res.status(400);
              res.write(subHtml);
              res.end();
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
              subHtml = fs.readFileSync('template/mailreceipt3.html', 'utf8')
              subHtml = subHtml.replace('responseBody', "Khong tim thay cac ghe trong giao dich")
              res.status(400);
              res.write(subHtml);
              res.end();
            }
          }
        });
      }
    }

  });

});

app.post("/delete_transactions", async (request, response) => {
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
});
app.get('/cancel', (req, res) => res.send({ message: 'Cancelled' }));
export default app;