import express from 'express';
import paypal from'paypal-rest-sdk';
import transactionsModel from "../models/transactionsModel.js"
import billsModel from "../models/billsModel.js"
const app = express.Router();
app.get("/", function (req, res) {
    res.send("paypal Routes");
});
app.get('/pay', (req, res) => {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:5000/api/paypal/success/1"+'?total='+"25.00"+'&currency='+"USD",
          "cancel_url": "http://localhost:5000/api/paypal/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Redhock Bar Soap",
                  "sku": "001",
                  "price": "25.00",
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": "25.00"
          },
          "description": "Washing Bar soap"
      }]
  };
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        console.log('i am here')
        throw error;
    } else {
        for(let i = 0;i < payment.links.length;i++){
          if(payment.links[i].rel === 'approval_url'){
            console.log(payment.links[i].href)
            res.redirect(payment.links[i].href);
          }
        }
    }
  });
  
  });
  app.get('/success/:buyer_id',async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const currency_for_execute = req.query.currency;
    const total_for_execute = req.query.total;
    
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": currency_for_execute,
              "total": total_for_execute
          }
      }]
    };
    let paymentInfo;
  // Obtains the transaction details from paypal
    paypal.payment.execute(paymentId, execute_payment_json,async function (error, payment) {
        //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.
      if (error) {
          console.log(error.response);
        res.status(500).send(error);
      } else {
        paymentInfo = payment;
        let buyer_id = req.params.buyer_id;
        let Name_items = [];
        let Sku_items = [];
        let Currency_items = [];
        let Price_items = [];
        let Quantity_items = [];
        for (let i = 0; i < paymentInfo.transactions[0].item_list.items.length; i++) {
            Name_items[i]=paymentInfo.transactions[0].item_list.items[i].name;
            Sku_items[i]=paymentInfo.transactions[0].item_list.items[i].sku;
            Quantity_items[i]=paymentInfo.transactions[0].item_list.items[i].quantity;
            Currency_items[i]=paymentInfo.transactions[0].item_list.items[i].currency;
            Price_items[i]=paymentInfo.transactions[0].item_list.items[i].price;
        }
        const data = await transactionsModel.create({
            buyer: buyer_id,
            Fname: paymentInfo.payer.payer_info.first_name,
            Lname: paymentInfo.payer.payer_info.last_name,
            recipient_name: paymentInfo.payer.payer_info.shipping_address.recipient_name,
            Seller: paymentInfo.transactions[0].payee.email,
            Line1: paymentInfo.payer.payer_info.shipping_address.line1,
            City: paymentInfo.payer.payer_info.shipping_address.city,
            postal_code: paymentInfo.payer.payer_info.shipping_address.postal_code,
            country_code: paymentInfo.payer.payer_info.shipping_address.country_code,
            Name_items:Name_items,
            Sku_items:Sku_items,
            dateCreate:paymentInfo.transactions[0].related_resources[0].sale.create_time,
            dateUpdate:paymentInfo.transactions[0].related_resources[0].sale.update_time,
            status:paymentInfo.payer.status,
            subTotal:paymentInfo.transactions[0].amount.details.subTotal,
            Fee_payment: paymentInfo.transactions[0].amount.details.handling_fee,
            Quantity_items:Quantity_items,
            Currency_items:Currency_items,
            Price_items:Price_items
          });
          res.status(200).send("done");
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
    const transaction = (await transactionsModel.find({ buyer: user_id,_id:id}));
    try {
        response.send(transaction);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/old_payments/:user_id/:page", async (request, response) => {
    const user_id = request.params.user_id;
    const page = request.params.page;
    const transaction = (await transactionsModel.find({ buyer: user_id}).sort({ "updatedAt": -1 }).skip(1 * page * 10).limit(10));
    const count = await transactionsModel.count({ buyer: user_id});
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
  app.get('/cancel', (req, res) => res.send({message:'Cancelled'}));
export default app;