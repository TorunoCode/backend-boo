import express from 'express';
import recommend from '../routeFunction/recommend.js';
const app = express.Router();
app.get('/recommend/:idMovie', async (req, res) => {
    recommend.sendRecommentMovie(req.params.idMovie);
    return res.status(200).send({ message: "done" });
})
app.get('/test/:idMovie/:idUser', async (req, res) => {
    recommend.addUserRecentBuyMovieGenre(req.params.idUser, req.params.idMovie);
    return res.status(200).send({ message: "done" });
})
export default app;