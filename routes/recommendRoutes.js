import express from 'express';
import recommend from '../routeFunction/recommend.js';
import recommendModel from '../models/recommendModel.js';
import mongoose from 'mongoose';
const app = express.Router();
app.get('/sendRecommend/:idMovie', async function (req, res) {
    if (!req.params.idMovie) {
        return res.status(400).send({ message: "Missing movie id" })
    }
    return res.status(200).send({ message: await recommend.sendRecommentMovie(req.params.idMovie) });
})

app.get('/getAll', async function (req, res) {
    return res.status(200).send(await recommendModel.find({}))
});
app.get('/checkpopulate/:id', async function (req, res) {
    return res.status(200).send("done")
})
app.get('/deleteAll', async function (req, res) {
    await recommendModel.deleteMany({})
    return res.status(200).send({ message: "done" });
})
export default app;