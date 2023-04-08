import emailHandle from "../commonFunction/emailHandle.js";
import recommendModel from "../models/recommendModel.js";
import movieModel from "../models/movieModel.js";
import userModel from "../models/userModel.js";
import fileHandle from "../commonFunction/fileHandle.js";
import { file } from "googleapis/build/src/apis/file/index.js";
async function addUserRecentBuyMovieGenre(idUser, idMovie) {
    var movieGerne = await movieModel.findById(idMovie)
    var userEmail = await userModel.findById(idUser)
    var query = { idCustomer: idUser },
        update = { genre: movieGerne.genre, email: userEmail.email },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };
    var result = await recommendModel.findOneAndUpdate(query, update, options);
    console.log(result)
    if (result) {
        return true
    }
    return false
}
async function sendRecommentMovie(idMovie) {
    var movie = await movieModel.findById(idMovie)
    var users = await recommendModel.find({ genre: movie.genre }).select('email -_id')
    console.log(users);
    var emails = users.map(item => item.email)
    console.log(emails);
    let emailBody = fileHandle.RecommendHtml(movie.image, movie.name)
    emailHandle.sendHttpMailBcc(emailBody, emails)

}
export default { addUserRecentBuyMovieGenre, sendRecommentMovie }