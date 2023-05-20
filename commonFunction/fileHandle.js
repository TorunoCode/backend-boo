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
    subHtml = subHtml.replace('DateOrder', timeHandle.formatDate_YearMonthDay(dateOrder))
    subHtml = subHtml.replace('MovieName', '' + movie + '');
    subHtml = subHtml.replace('CinemaName', '' + cinema + '');
    subHtml = subHtml.replace('DateName', '' + date + '');
    subHtml = subHtml.replace('SessionName', '' + session + '');
    subHtml = subHtml.replace('SeatName', '' + seat + '');
    subHtml = subHtml.replace('SeatQuantity', '' + billsOfUser.length + '');
    subHtml = subHtml.replace('SeatQuantityMoney', '' + total_for_execute + '')
    subHtml = subHtml.replace('TotalVatMoney', '' + total_for_execute + '')
    return subHtml;
}
export default { template3Notification, template4Notification, RecommendHtml, invoice }