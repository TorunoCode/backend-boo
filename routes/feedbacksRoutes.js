import express from 'express';
import feedbacksModel from "../models/feedbacksModel.js";
import timeHandle from '../commonFunction/timeHandle.js';
import UserModal from '../models/userModel.js';
import MovieModel from '../models/movieModel.js';
import OrderModel from '../models/orderModel.js';

const app = express.Router();
app.get("/", function (req, res) {
    res.send("comment feedback post");
});
app.get("/testDeleteUser/:id", async function (req, res) {
    await UserModal.findByIdAndDelete(req.params.id)
    res.send("done")
    return
});
app.get("/testSession/:id", async function (req, res) {
    req.session.userId = { uuid: req.params.id }
    req.session.save((err => {
        if (err) {
            console.log(err);
        } else {
            res.send("done: " + req.session.userId.uuid)
        }
    }));
    return
});
app.get("/testGetSession", async function (req, res) {
    try {
        res.send(req.session.userId.uuid + "/" + req.session.userId)
    } catch (error) {
        res.send(error)
    }
    return
});
app.post("/delete_allfeedback", async (request, response) => {

    try {
        await feedbacksModel.deleteMany({});
        response.send({ message: 'done delete all feedback' });
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/add_feedback", async function (request, response) {
    const feedback = new feedbacksModel(request.body);
    const Orders = await OrderModel.find({ idCustomer: feedback.userId }).select('idShowing').populate({
        path: "Ordershowing",
        match: { idMovie: feedback.movieId },
        select: 'idMovie -_id'
    })
    //tìm xem coi trong Order có tìm tìm kiếm trên có cái nào có tìm được showing không
    var picked = Orders.find(o => o.Ordershowing != null);
    if (!picked)
        return response.status(400).send({ message: 'You have to buy ticket for movie first' })
    //feedback.userId = request.session.userId; 
    try {
        await feedback.save();
        var data = await feedbacksModel.aggregate([{
            $match: { movieId: feedback.movieId }
        }, { $group: { _id: "$movieId", avg_val: { $avg: "$rate" } } }]);
        await MovieModel.findByIdAndUpdate(data[0]._id, { $set: { rate: Math.round(data[0].avg_val * 10) / 10 } });
        return response.send({ message: 'done add feedback, user have feedback ' + numAdd });
    } catch (error) {
        return response.status(500).send(error);
    }
});
app.post("/delete_feedback", async function (request, response) {
    const feedback = new feedbacksModel(request.body);

    try {
        await feedbacksModel.deleteOne({ _id: feedback['_id'] });
        return response.send({ message: 'done delete feedback' });
    } catch (error) {
        return response.status(500).send(error);
    }
});
app.get("/feedbacks/:movieId/:page", async (request, response) => {
    const movieId = request.params.movieId;
    const page = request.params.page;
    const feedbacks = await feedbacksModel.find({ movieId: movieId }).sort({ "updatedAt": -1 }).skip(1 * page * 10).limit(10);
    const count = await feedbacksModel.count({ movieId: movieId });
    const numpage = Math.ceil(count / 10);
    const allCommentsOfMovie = { number_of_feedback: count, _number_of_page: numpage };
    const result = [];
    for (const element of feedbacks) {
        let nameUser = await UserModal.findById(element['userId']);
        const eachUser = {}
        var updatedAt = timeHandle.formatTime(element.updatedAt)
        var createdAt = timeHandle.formatTime(element.createdAt)
        let updatedAtTimeElapsed = timeHandle.timeElapsedSecond(element.updatedAt)
        let createdAtTimeElapsed = timeHandle.timeElapsedSecond(element.createdAt)
        let updatedAtTimeElapsedModded = timeHandle.timeElapsedDayRemand(element.updatedAt) + 'day(s) ' + timeHandle.timeElapsedHourRemand(element.updatedAt) + 'h ' + timeHandle.timeElapsedMinuteRemand(element.updatedAt) + 'm ' + timeHandle.timeElapsedSecondRemand(element.updatedAt) + 's';
        let createdAtTimeElapsedModded = timeHandle.timeElapsedDayRemand(element.createdAt) + 'day(s) ' + timeHandle.timeElapsedHourRemand(element.createdAt) + 'h ' + timeHandle.timeElapsedMinuteRemand(element.createdAt) + 'm ' + timeHandle.timeElapsedSecondRemand(element.createdAt) + 's';
        let userName, userFullName, userAvartar;
        if (!nameUser) {
            userName = 'Not found user, id:' + element['userId']
            userFullName = 'Not found user, id:' + element['userId']
            userAvartar = null
        }
        else {
            userFullName = nameUser['fullName']
            userName = nameUser['name']
            try {
                new URL(nameUser['avatar'])
                userAvartar = nameUser['avatar']
            } catch {
                userAvartar = null
            }
        }
        Object.assign(eachUser, {
            '_id': element.id, 'userId': element.userId, 'title': element.title,
            'detail': element.detail, 'movieId': element.movieId, 'rate': element.rate,
            'createdAt': createdAt, 'updatedAt': updatedAt, '__v': element.__v,
            'userName': userName,
            'orgirnUpdatedAt': element.updatedAt, 'orgirnCreatedAt': element.createdAt,
            'updatedAtTimeElapsed': updatedAtTimeElapsed,
            'createdAtTimeElapsed': createdAtTimeElapsed,
            'updatedAtTimeElapsedModded': updatedAtTimeElapsedModded,
            'createdAtTimeElapsedModded': createdAtTimeElapsedModded,
            'fullName': userFullName,
            'avatar': userAvartar
        })
        result.push(eachUser);
    }
    result.push(allCommentsOfMovie);

    return response.status(200).send(result);
});

export default app;