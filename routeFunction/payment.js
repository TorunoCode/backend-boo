import orderModel from "../models/orderModel.js";
import showSeatModel from '../models/showSeatModel.js';
import billsModel from "../models/billsModel.js"
import ShowingModel from '../models/showingModel.js';
import MovieModel from '../models/movieModel.js';
import cinemaModel from '../models/cinemaModel.js';
import fileHandle from '../commonFunction/fileHandle.js';
import timeHandle from '../commonFunction/timeHandle.js';
import emailHandle from '../commonFunction/emailHandle.js';
import recommend from "./recommend.js";
async function sendEmailInvoice(paymentId, idUser, total_for_execute, dateOrder) {
    //user vừa trả tiền status vẫn = -1
    let bill = await billsModel.find({ idCustomer: idUser, status: "-1" })
    console.log(bill)
    let billsOfUser = await orderModel.find({ idBill: bill[0]._id });
    let movie = '';
    let Cinema = '';
    let date = '';
    let session = '';
    let seat = '';
    console.log(billsOfUser)
    console.log("done check")
    //1 bill chỉ có 1 phim
    //add vô recommend
    let showingRecommend = await ShowingModel.findById(billsOfUser[0].idShowing)
    let movieRecommend = await MovieModel.findById(showingRecommend.idMovie);
    recommend.addUserRecentBuyMovieGenre(idUser, movieRecommend.id)
    let Cinematemp;
    movie = " " + movieRecommend.name;
    Cinematemp = await cinemaModel.findById(showingRecommend.idCinema);
    Cinema = " " + Cinematemp.name;
    date = " " + timeHandle.formatDate_YearMonthDay(showingRecommend.startTime)
    session = " " + showingRecommend.time
    for (let i = 0; i < billsOfUser.length; i++) {
        let showSeat = await showSeatModel.findById(billsOfUser[i].idShowSeat);
        console.log("tohere")
        try {
            if (seat.indexOf(showSeat.number) == -1)
                seat = seat + ', ' + showSeat.number
        }
        catch (error) {
            return false
        }
    }
    console.log("to send email")
    let sendEmailResult = await emailHandle.sendInvoice(
        paymentId, idUser, movie, Cinema, date, session, seat,
        billsOfUser, total_for_execute, dateOrder
    )
    if (!sendEmailResult) {
        return false
    }
    return true
}
export default { sendEmailInvoice }