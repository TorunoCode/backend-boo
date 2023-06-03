import dotenv from 'dotenv'
dotenv.config();
import emailHandle from "../commonFunction/emailHandle.js";
import recommendModel from "../models/recommendModel.js";
import movieModel from "../models/movieModel.js";
import userModel from "../models/userModel.js";
import fileHandle from "../commonFunction/fileHandle.js";
import { file } from "googleapis/build/src/apis/file/index.js";
async function addUserRecentBuyMovieGenre(idUser, idMovie) {
    var movieGerne = await movieModel.findById(idMovie)
    let recommendTest = await recommendModel.findOne({ idCustomer: idUser, genre: movieGerne.genre });
    if (!recommendTest) {
        recommendTest = await recommendModel.create({ idCustomer: idUser, genre: movieGerne.genre, count: 1 })
    }
    else {
        let count = recommendTest.count
        count = count + 1
        // let count
        // count = 2
        recommendTest = await recommendModel.findOneAndUpdate({ idCustomer: idUser, genre: movieGerne.genre }, { count: count })
    }
    if (recommendTest) {
        return true
    }
    return false
}
async function sendRecommentMovie(idMovie) {
    var movie = await movieModel.findById(idMovie)
    console.log(process.env.min_payment_to_recommend)
    if (!movie)
        return "Can't find movie"
    var users = await recommendModel.find({ genre: movie.genre, count: { $gte: parseInt(process.env.min_payment_to_recommend) } }).populate("user")
    if (users[0] == null) {
        var users = await recommendModel.find({})
        return "No user to send"
    }
    var emails = users.map(item => item.user.email)
    let emailBody = fileHandle.RecommendHtml(movie.image, movie.name)
    let test = await emailHandle.sendHttpMailBcc(emailBody, emails)
    if (!test)
        return "Can't send Email"
    return "done sending"
}
export default { addUserRecentBuyMovieGenre, sendRecommentMovie }