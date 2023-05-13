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
    let showingRecommend = await ShowingModel.findById(billsOfUser[0].idShowSeat)
    let movieRecommend = await MovieModel.findById(showingRecommend.idMovie);
    recommend.addUserRecentBuyMovieGenre(idUser, movieRecommend.id)

    for (let i = 0; i < billsOfUser.length; i++) {
        let showSeat = await showSeatModel.findById(billsOfUser[i].idShowSeat);
        console.log("tohere")
        try {
            let showingtemp;
            let movietemp;
            let Cinematemp;
            showingtemp = await ShowingModel.findById(showSeat.idShowing);
            movietemp = await MovieModel.findById(showingtemp.idMovie);
            movietemp = movietemp.name;
            Cinematemp = await cinemaModel.findById(showingtemp.idCinema);
            Cinematemp = Cinematemp.name;
            var datetemp = timeHandle.formatDate_YearMonthDay(showingtemp.startTime)
            if (session.indexOf(showingtemp.time) == -1)
                session = session + ', ' + showingtemp.time;
            if (date.indexOf(datetemp) == -1)
                date = date + ', ' + datetemp;
            if (movie.indexOf(movietemp) == -1)
                movie = movie + ', ' + movietemp;
            if (Cinema.indexOf(Cinematemp) == -1)
                Cinema = Cinema + ', ' + Cinematemp;
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