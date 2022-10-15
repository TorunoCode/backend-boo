import express from 'express';
import commentsModel from "../models/commentsModel.js";
import responseToCommentsModel from "../models/responseToCommentsModel.js";
import reviewsModel from "../models/reviewsModel.js";
import UserModal from '../models/userModel.js';

const app = express.Router();
app.get("/", function (req, res) {
    res.send("comment Reviews post");
});
app.post("/add_comments", async (request, response) => {
    const comments = new commentsModel(request.body);

    try {
        await comments.save();
        response.send({message:'done add comment'});
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/delete_comments", async (request, response) => {
    const comments = new commentsModel(request.body);

    try {
        await commentsModel.deleteOne({_id:comments['_id']});
        response.send({message: 'done delete comment'});
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/add_reviews", async (request, response) => {
    const reviews = new reviewsModel(request.body);

    try {
        await reviews.save();
        response.send({message:'done add reviews'});
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/delete_reviews", async (request, response) => {
    const reviews = new reviewsModel(request.body);

    try {
        await reviewsModel.deleteOne({_id:reviews['_id']});
        response.send({message: 'done delete review'});
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/delete_responseToCommentsModel", async (request, response) => {
    const reviews = new responseToCommentsModel(request.body);

    try {
        await responseToCommentsModel.deleteOne({_id:reviews['_id']});
        response.send({message: 'done delete response to comment'});
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/add_responseToCommentsModel", async (request, response) => {
    const responseToComments = new responseToCommentsModel(request.body);

    try {
        await responseToComments.save();
        response.send({message:'done add response to comments'});
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
    const comments = (await commentsModel.find({ movieId: movieId, replyToCommentId:"" }).sort({ "updatedAt": -1 }).skip(1 * page * 10).limit(10));
    const count = await commentsModel.count({ movieId: movieId, replyToCommentId:"" });
    const numpage = Math.ceil(count / 10);
    console.log("movie id " + movieId + " num comment: " + count)
    const allCommentsOfMovie = { number_of_comment: count, _number_of_page:  numpage };
    comments.push(allCommentsOfMovie);
    try {
        response.send(comments);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/reviews/:movieId/:page", async (request, response) => {
    const movieId = request.params.movieId;
    const page = request.params.page;
    const reviews = await reviewsModel.find({movieId: movieId }).sort({ "updatedAt": -1 }).skip(1 * page * 10).limit(10);
    const count = await reviewsModel.count({ movieId: movieId });
    const numpage = Math.ceil(count / 10);
    console.log("movie id " + movieId + " num reviews: " + count)
    const allCommentsOfMovie = { number_of_review: count, _number_of_page:  numpage };
    reviews.push(allCommentsOfMovie);
    try {
        response.send(reviews);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/sum_reviews/:movieId", async (request, response) => {
    const movieId = request.params.movieId;
    const count = await reviewsModel.count({ movieId: movieId });
    const numpage = Math.ceil(count / 10);
    console.log("movie id " + movieId + " num reviews: " + count)
    const allCommentsOfMovie = { number_of_review: count, _number_of_page:  numpage };
    const result=[];
    result.push(allCommentsOfMovie);
    const sum_reviews = await reviewsModel.aggregate([{$match:{movieId: movieId }},{$group:{_id: null,sum_review:{$sum: "$rate"} }}])
    const avg_reviews = sum_reviews[0]['sum_review']/count;
    const result_avg_reviews={avg_of_movie_review:avg_reviews};
    result.push(result_avg_reviews);
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
    const responseToComments = await commentsModel.find({movieId: movieId,replyToCommentId: commentId }).sort({ "updatedAt": -1 }).skip(1 * page * 10).limit(10);
    const count = await commentsModel.count({ movieId: movieId, replyToCommentId: commentId  });
    const numpage = Math.ceil(count / 10);
    console.log("movie id " + movieId + " num reviews: " + count)
    const allCommentsOfMovie = { number_of_comment_for_this_comment: count, _number_of_page:  numpage };
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
    const count = await responseToCommentsModel.count({ movieId: movieId, commentId: commentId  });
    const allCommentsOfMovie = { number_of_like_dislike_for_this_comment: count};
    const count_like = await responseToCommentsModel.count({ movieId: movieId, commentId: commentId, likeDislike: true });
    const allCommentsOfMovie_like = { number_of_like_for_this_comment: count_like};
    const count_dislike = await responseToCommentsModel.count({ movieId: movieId, commentId: commentId, likeDislike: false });
    const allCommentsOfMovie_dislike = { number_of_dislike_for_this_comment: count_dislike};
    const count_response = await commentsModel.count({ movieId: movieId, replyToCommentId: commentId  });
    const numpage = Math.ceil(count_response / 10);
    const allCommentToThissOfMovie = { number_of_comment_for_this_comment: count_response, _number_of_page:  numpage };

    const result=[];
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
        const result= await UserModal.findById(request.params.userId).select('name');
        console.log(result);
        response.send(result);
    } catch (error) {
        console.log(error)
        response.status(500).send(error);
    }
});

export default app;