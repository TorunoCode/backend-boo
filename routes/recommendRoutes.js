import express from 'express';
import recommend from '../routeFunction/recommend.js';
import recommendModel from '../models/recommendModel.js';
import mongoose from 'mongoose';
const app = express.Router();
app.get('/sendRecommend/:idMovie', async function (req, res) {
    await recommend.sendRecommentMovie(req.params.idMovie);
    return res.status(200).send({ message: "done" });
})
/*app.get('/test/:idMovie/:idUser', async function (req, res) {
    recommend.addUserRecentBuyMovieGenre(req.params.idUser, req.params.idMovie);
    return res.status(200).send({ message: "done" });
})*/
app.get('/deleteAll', async function (req, res) {
    await recommendModel.deleteMany({})
    return res.status(200).send({ message: "done" });
})
/*app.get('/drop', async function (req, res) {
    recommendModel.collection.dropIndex("email")
    return res.status(200).send({ message: "done" });
})*/
export default app;