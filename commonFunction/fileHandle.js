import fs from 'fs';
import path from 'path';
import timeHandle from './timeHandle.js';
function template3Notification(responseBody) {
    var subHtml = fs.readFileSync(path.join(path.resolve(process.cwd(), "template"), 'mailreceipt3.html'), 'utf8')
    subHtml = subHtml.replace('responseBody', responseBody)
    return subHtml;
}
function template4Notification(responseBody) {
    var subHtml = fs.readFileSync(path.join(path.resolve(process.cwd(), "template"), 'mailreceipt4.html'), 'utf8')
    subHtml = subHtml.replace('responseBody', responseBody)
    return subHtml;
}
function RecommendHtml(MovieImage, MovieName) {
    var subHtml = fs.readFileSync(path.join(path.resolve(process.cwd(), "template"), 'Recommend.html'), 'utf8')
    subHtml = subHtml.replace('MovieImage', MovieImage)
    subHtml = subHtml.replace('MovieName', MovieName)
    subHtml = subHtml.replace('MovieName2', MovieName)
    return subHtml;
}
function invoice(paymentId, movie, cinema, date, session, seat, billsOfUser, total_for_execute, dateOrder) {
    var subHtml = fs.readFileSync(path.join(path.resolve(process.cwd(), "template"), 'mailreceipt2.html'), 'utf8')
    subHtml = subHtml.replace('OrderNumber', paymentId)
    //subHtml = subHtml.replace('DateOrder', payment.transactions[0].related_resources[0].sale.update_time.substring(0, 10))
    console.log(dateOrder)
    subHtml = subHtml.replace('DateOrder', timeHandle.formatDate_YearMonthDay(dateOrder))
    console.log(movie)
    subHtml = subHtml.replace('MovieName', '' + movie + '');
    console.log(cinema)
    subHtml = subHtml.replace('CinemaName', '' + cinema + '');
    console.log(date)
    subHtml = subHtml.replace('DateName', '' + date + '');
    console.log(session)
    subHtml = subHtml.replace('SessionName', '' + session + '');
    console.log(seat)
    subHtml = subHtml.replace('SeatName', '' + seat + '');
    console.log(billsOfUser.length)
    subHtml = subHtml.replace('SeatQuantity', '' + billsOfUser.length + '');
    console.log(total_for_execute)
    subHtml = subHtml.replace('SeatQuantityMoney', '' + total_for_execute + '')
    subHtml = subHtml.replace('TotalVatMoney', '' + total_for_execute + '')
    return subHtml;
}
export default { template3Notification, template4Notification, RecommendHtml, invoice }