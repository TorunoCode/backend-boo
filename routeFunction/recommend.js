import emailHandle from "../commonFunction/emailHandle.js";
import recommendModel from "../models/recommendModel.js";
import movieModel from "../models/movieModel.js";
import userModel from "../models/userModel.js";
import fileHandle from "../commonFunction/fileHandle.js";
import { file } from "googleapis/build/src/apis/file/index.js";
async function addUserRecentBuyMovieGenre(idUser, idMovie) {
    var movieGerne = await movieModel.findById(idMovie)
    var userEmail = await userModel.findById(idUser);
    let recommendTest = await recommendModel.findOne({ idCustomer: idUser, genre: movieGerne.genre });
    console.log(recommendTest)
    if (!recommendTest) {
        console.log("here")
        recommendTest = await recommendModel.create({ idCustomer: idUser, genre: movieGerne.genre, email: userEmail.email, count: 1 })
    }
    else {
        console.log("else")
        let count = recommendTest.count
        //count = count + 1
        count = 2
        console.log(count)
        recommendTest = await recommendModel.findOneAndUpdate({ idCustomer: idUser, genre: movieGerne.genre }, { count: count })
    }
    if (recommendTest) {
        return true
    }
    return false
}
async function sendRecommentMovie(idMovie) {
    var movie = await movieModel.findById(idMovie)
    var users = await recommendModel.find({ genre: movie.genre, count: { $gte: 2 } }).select('email -_id')
    console.log(users);
    if (users[0] == null) {
        var users = await recommendModel.find({})
        console.log(users)
        return
    }
    var emails = users.map(item => item.email)
    console.log(emails);
    let emailBody = fileHandle.RecommendHtml(movie.image, movie.name)
    let test = emailHandle.sendHttpMailBcc(emailBody, emails)
    return
}
export default { addUserRecentBuyMovieGenre, sendRecommentMovie }