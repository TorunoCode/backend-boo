import express from 'express';
import commentsModel from "../models/commentsModel.js";
import responseToCommentsModel from "../models/responseToCommentsModel.js";
import feedbacksModel from "../models/feedbacksModel.js";
import timeHandle from '../commonFunction/timeHandle.js';
import UserModal from '../models/userModel.js';
import MovieModel from '../models/movieModel.js';


const app = express.Router();
app.get("/", function (req, res) {
    res.send("comment feedback post");
});
app.get("/testDeleteUser/:id", async function (req, res) {
    await UserModal.findByIdAndDelete(req.params.id)
    res.send("done")
    return
});
/*app.post("/add_comments", async (request, response) => {
    const comments = new commentsModel(request.body);

    try {
        await comments.save();
        response.send({ message: 'done add comment' });
    } catch (error) {
        response.status(500).send(error);
    }
});*/
app.post("/delete_allfeedback", async (request, response) => {

    try {
        await feedbacksModel.deleteMany({});
        console.log('to delete all feadback');
        response.send({ message: 'done delete all feedback' });
    } catch (error) {
        response.status(500).send(error);
    }
});
/*app.post("/delete_comments", async (request, response) => {
    const comments = new commentsModel(request.body);

    try {
        await commentsModel.deleteOne({ _id: comments['_id'] });
        response.send({ message: 'done delete comment' });
    } catch (error) {
        response.status(500).send(error);
    }
});*/
app.post("/add_feedback", async (request, response) => {
    const feedback = new feedbacksModel(request.body);
    try {
        const count = await feedbacksModel.count({ userId: feedback.userId, movieId: feedback.movieId });
        var numAdd = parseInt(count) + 1;
        if (false) {
            return response.status(400).json({ data: null, message: "User already feedback " + numAdd });
        }
        await feedback.save();
        var data = await feedbacksModel.aggregate([{
            $match: { movieId: feedback.movieId }
        }, { $group: { _id: "$movieId", avg_val: { $avg: "$rate" } } }]);
        console.log(data)
        await MovieModel.findByIdAndUpdate(data[0]._id, { $set: { rate: Math.round(data[0].avg_val * 10) / 10 } });
        response.send({ message: 'done add feedback, user have feedback ' + numAdd });
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/delete_feedback", async (request, response) => {
    const feedback = new feedbacksModel(request.body);

    try {
        await feedbacksModel.deleteOne({ _id: feedback['_id'] });
        response.send({ message: 'done delete feedback' });
    } catch (error) {
        response.status(500).send(error);
    }
});
/*
app.post("/delete_responseToCommentsModel", async (request, response) => {
    const feedbacks = new responseToCommentsModel(request.body);

    try {
        await responseToCommentsModel.deleteOne({ _id: feedbacks['_id'] });
        response.send({ message: 'done delete response to comment' });
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/add_responseToCommentsModel", async (request, response) => {
    const responseToComments = new responseToCommentsModel(request.body);

    try {
        await responseToComments.save();
        response.send({ message: 'done add response to comments' });
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/comments", async (request, response) => {
    const comments = await commentsModel.find().sort({ "updatedAt": -1 });
    try {
        response.send(comments);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/comments/:movieId/:page", async (request, response) => {
    const movieId = request.params.movieId;
    const page = request.params.page;
    const comments = (await commentsModel.find({ movieId: movieId, replyToCommentId: "" }).sort({ "updatedAt": -1 }).skip(1 * page * 10).limit(10));
    const count = await commentsModel.count({ movieId: movieId, replyToCommentId: "" });
    const numpage = Math.ceil(count / 10);
    console.log("movie id " + movieId + " num comment: " + count)
    const allCommentsOfMovie = { number_of_comment: count, _number_of_page: numpage };
    comments.push(allCommentsOfMovie);
    try {
        response.send(comments);
    } catch (error) {
        response.status(500).send(error);
    }
});*/
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
        console.log(nameUser)
        const eachUser = {}
        var updatedAt = timeHandle.formatTime(element.updatedAt)
        var createdAt = timeHandle.formatTime(element.createdAt)
        let updatedAtTimeElapsed = timeHandle.timeElapsedSecond(element.updatedAt)
        let createdAtTimeElapsed = timeHandle.timeElapsedSecond(element.createdAt)
        let updatedAtTimeElapsedModded = timeHandle.timeElapsedDayRemand(element.updatedAt) + 'day(s) ' + timeHandle.timeElapsedHourRemand(element.updatedAt) + 'h ' + timeHandle.timeElapsedMinuteRemand(element.updatedAt) + 'm ' + timeHandle.timeElapsedSecondRemand(element.updatedAt) + 's';
        let createdAtTimeElapsedModded = timeHandle.timeElapsedDayRemand(element.createdAt) + 'day(s) ' + timeHandle.timeElapsedHourRemand(element.createdAt) + 'h ' + timeHandle.timeElapsedMinuteRemand(element.createdAt) + 'm ' + timeHandle.timeElapsedSecondRemand(element.createdAt) + 's';
        console.log(updatedAt + '///' + element.updatedAt.getMonth() + '///' + element.updatedAt);
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
        console.log(nameUser['avatar'] + '/' + nameUser['fullName'])
        result.push(eachUser);
    }
    result.push(allCommentsOfMovie);

    /*const movie = await MovieModel.find({});
    const rating = await feedbackModel.distinct('movieId',{});
    
        for (let item of movie) {
            const data = await feedbackModel.findOne({ movieId: item._id.toString() });
            if (data == null) { await MovieModel.findById(item._id.toString()).updateOne({ $set: { rate: 0 } }); }
        }*/
    response.status(200).send(result);
});
/*
app.get("/sum_feedbacks/:movieId", async (request, response) => {
    const movieId = request.params.movieId;
    const count = await feedbacksModel.count({ movieId: movieId });
    const numpage = Math.ceil(count / 10);
    console.log("movie id " + movieId + " num feedbacks: " + count)
    const allCommentsOfMovie = { number_of_feedback: count, _number_of_page: numpage };
    const result = [];
    result.push(allCommentsOfMovie);
    const sum_feedbacks = await feedbacksModel.aggregate([{ $match: { movieId: movieId } }, { $group: { _id: null, sum_feedback: { $sum: "$rate" } } }])
    const avg_feedbacks = sum_feedbacks[0]['sum_feedback'] / count;
    const result_avg_feedbacks = { avg_of_movie_feedback: avg_feedbacks };
    result.push(result_avg_feedbacks);
    try {
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/responseToCommentsModel/:movieId/:page/:commentId", async (request, response) => {
    const movieId = request.params.movieId;
    const page = request.params.page;
    const commentId = request.params.commentId;
    const responseToComments = await commentsModel.find({ movieId: movieId, replyToCommentId: commentId }).sort({ "updatedAt": -1 }).skip(1 * page * 10).limit(10);
    const count = await commentsModel.count({ movieId: movieId, replyToCommentId: commentId });
    const numpage = Math.ceil(count / 10);
    console.log("movie id " + movieId + " num feedbacks: " + count)
    const allCommentsOfMovie = { number_of_comment_for_this_comment: count, _number_of_page: numpage };
    responseToComments.push(allCommentsOfMovie);
    try {
        response.send(responseToComments);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/sumresponseToComments/:movieId/:commentId", async (request, response) => {
    const movieId = request.params.movieId;
    const commentId = request.params.commentId;
    const count = await responseToCommentsModel.count({ movieId: movieId, commentId: commentId });
    const allCommentsOfMovie = { number_of_like_dislike_for_this_comment: count };
    const count_like = await responseToCommentsModel.count({ movieId: movieId, commentId: commentId, likeDislike: true });
    const allCommentsOfMovie_like = { number_of_like_for_this_comment: count_like };
    const count_dislike = await responseToCommentsModel.count({ movieId: movieId, commentId: commentId, likeDislike: false });
    const allCommentsOfMovie_dislike = { number_of_dislike_for_this_comment: count_dislike };
    const count_response = await commentsModel.count({ movieId: movieId, replyToCommentId: commentId });
    const numpage = Math.ceil(count_response / 10);
    const allCommentToThissOfMovie = { number_of_comment_for_this_comment: count_response, _number_of_page: numpage };

    const result = [];
    result.push(allCommentsOfMovie);
    result.push(allCommentsOfMovie_like);
    result.push(allCommentsOfMovie_dislike);
    result.push(allCommentToThissOfMovie);
    try {
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/getUserNamePic/:userId", async (request, response) => {
    try {
        const result = await UserModal.findById(request.params.userId).select('name');
        console.log(result);
        response.send(result);
    } catch (error) {
        console.log(error)
        response.status(500).send(error);
    }
});
*/
export default app;