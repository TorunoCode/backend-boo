import express from 'express';
import billsModel from "../models/billsModel.js"
const app = express.Router();
app.get("/", function (req, res) {
    res.send("bill Routes");
});
app.post("/add_bills", async (request, response) => {
    const bill = new billsModel(request.body);

    try {
        await bill.save();
        response.send({ message: 'done add bill' });
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/delete_allbills", async (request, response) => {

    try {
        await billsModel.deleteMany({});
        console.log('to delete all bills');
        response.send({ message: 'done delete all bills' });
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/delete_bills", async (request, response) => {

    try {
        await billsModel.deleteOne({ _id: request.body._id });
        response.send({ message: 'done delete bill' });
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/bills/:userId/:page", async (request, response) => {
    const userId = request.params.userId;
    const page = request.params.page;
    const bills = (await billsModel.find({ idCustomer: userId}).sort({ "updatedAt": -1 }).skip(1 * page * 10).limit(10));
    const count = await billsModel.count({ idCustomer: userId});
    const numpage = Math.ceil(count / 10);
    console.log("user id " + userId + " num bills: " + count)
    const allBillOfUser = { number_of_bill: count, _number_of_page: numpage };
    bills.push(allBillOfUser);
    try {
        response.send(bills);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/oneBill/:userId/:id", async (request, response) => {
    const userId = request.params.userId;
    const id = request.params.id;
    const bills = await billsModel.find({ idCustomer: userId,_id:id});
    const count = await billsModel.count({ idCustomer: userId});
    const numpage = Math.ceil(count / 10);
    console.log("user id " + movieId + " num bills: " + count)
    const allBillOfUser = { number_of_bill: count, _number_of_page: numpage };
    bills.push(allBillOfUser);
    try {
        response.send(bills);
    } catch (error) {
        response.status(500).send(error);
    }
});
export default app;