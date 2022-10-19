import express from 'express';
import commentsModel from "../models/commentsModel.js";
import responseToCommentsModel from "../models/responseToCommentsModel.js";
import feadbacksModel from "../models/feadbacksModel.js";
import UserModal from '../models/userModel.js';

const app = express.Router();
app.get("/", function (req, res) {
    res.send("comment feedback post");
});
app.post("/add_comments", async (request, response) => {
    const comments = new commentsModel(request.body);

    try {
        await comments.save();
        response.send({ message: 'done add comment' });
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/delete_comments", async (request, response) => {
    const comments = new commentsModel(request.body);

    try {
        await commentsModel.deleteOne({ _id: comments['_id'] });
        response.send({ message: 'done delete comment' });
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/add_feadback", async (request, response) => {
    const feadback = new feadbacksModel(request.body);

    try {
        await feadback.save();
        response.send({ message: 'done add feadback' });
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/delete_feadback", async (request, response) => {
    const feadback = new feadbacksModel(request.body);

    try {
        await feadbacksModel.deleteOne({ _id: feadback['_id'] });
        response.send({ message: 'done delete feadback' });
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/delete_responseToCommentsModel", async (request, response) => {
    const feadbacks = new responseToCommentsModel(request.body);

    try {
        await responseToCommentsModel.deleteOne({ _id: feadbacks['_id'] });
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
});
app.get("/feadbacks/:movieId/:page", async (request, response) => {
    const movieId = request.params.movieId;
    const page = request.params.page;
    const feadbacks = await feadbacksModel.find({ movieId: movieId }).sort({ "updatedAt": -1 }).skip(1 * page * 10).limit(10);
    const count = await feadbacksModel.count({ movieId: movieId });
    const numpage = Math.ceil(count / 10);
    console.log("movie id " + movieId + " num feadbacks: " + count)
    const allCommentsOfMovie = { number_of_feadback: count, _number_of_page: numpage };
    const result = [];
    for (const element of feadbacks) {
        const nameUser = await UserModal.findById(element['userId']).select('name -_id');
        const eachUser = {}
        Object.assign(eachUser, {
            '_id': element.id, 'userId': element.userId, 'title': element.title,
            'detail': element.detail, 'movieId': element.movieId, 'rate': element.rate,
            'createdAt': element.createdAt, 'updatedAt': element.updatedAt, '__v': element.__v,
            'userName': nameUser['name']
        })
        console.log(eachUser);
        result.push(eachUser);
    }
    result.push(allCommentsOfMovie);
    try {
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/sum_feadbacks/:movieId", async (request, response) => {
    const movieId = request.params.movieId;
    const count = await feadbacksModel.count({ movieId: movieId });
    const numpage = Math.ceil(count / 10);
    console.log("movie id " + movieId + " num feadbacks: " + count)
    const allCommentsOfMovie = { number_of_feadback: count, _number_of_page: numpage };
    const result = [];
    result.push(allCommentsOfMovie);
    const sum_feadbacks = await feadbacksModel.aggregate([{ $match: { movieId: movieId } }, { $group: { _id: null, sum_feadback: { $sum: "$rate" } } }])
    const avg_feadbacks = sum_feadbacks[0]['sum_feadback'] / count;
    const result_avg_feadbacks = { avg_of_movie_feadback: avg_feadbacks };
    result.push(result_avg_feadbacks);
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
    console.log("movie id " + movieId + " num feadbacks: " + count)
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

export default app;