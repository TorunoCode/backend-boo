import emailProvider from '../config/nodeMailer.js';
import fileHandle from './fileHandle.js';
import userModel from '../models/userModel.js';
async function sendOTPMail(OTP, mail) {
    var subHtml = fileHandle.template4Notification("Your OTP: " + OTP)
    var mailOptions = {
        from: 'backendtlcn@gmail.com',
        to: mail,
        subject: 'OTP verify',
        html: subHtml
    };
    const result = await new Promise((resolve, reject) => {
        emailProvider.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        })
    });
    return result
}
async function sendCreateAccountPass(password, mail) {
    var subHtml = fileHandle.template4Notification("Account created with password: " + password)
    var mailOptions = {
        from: 'backendtlcn@gmail.com',
        to: mail,
        subject: 'Create account',
        html: subHtml
    };
    const result = await new Promise((resolve, reject) => {
        emailProvider.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        })
    });
    return result
}
async function sendHttpMailBcc(emailBody, mail) {
    var subHtml = emailBody
    var mailOptions = {
        from: 'backendtlcn@gmail.com',
        bcc: mail,
        subject: 'Recommend',
        html: subHtml
    };
    const result = await new Promise((resolve, reject) => {
        emailProvider.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        })
    });
    return result
}
async function sendInvoice(paymentId, payment, movie, cinema, date, session, seat, billsOfUser, total_for_execute) {
    subHtml = fs.readFileSync(path.join(path.resolve(process.cwd(), "template"), 'mailreceipt2.html'), 'utf8')
    subHtml = subHtml.replace('OrderNumber', paymentId)
    subHtml = subHtml.replace('DateOrder', payment.transactions[0].related_resources[0].sale.update_time.substring(0, 10))
    console.log(movie)
    movie = movie.substring(1)
    subHtml = subHtml.replace('MovieName', '' + movie + '');
    Cinema = Cinema.substring(1)
    console.log(Cinema)
    subHtml = subHtml.replace('CinemaName', '' + cinema + '');
    date = date.substring(1)
    console.log(date)
    subHtml = subHtml.replace('DateName', '' + date + '');
    session = session.substring(1)
    console.log(session)
    subHtml = subHtml.replace('SessionName', '' + session + '');
    console.log(seat)
    seat = seat.substring(1)
    subHtml = subHtml.replace('SeatName', '' + seat + '');
    console.log(billsOfUser.length)
    subHtml = subHtml.replace('SeatQuantity', '' + billsOfUser.length + '');
    console.log(total_for_execute)
    subHtml = subHtml.replace('SeatQuantityMoney', '' + total_for_execute + '')
    subHtml = subHtml.replace('TotalVatMoney', '' + total_for_execute + '')
    console.log("done to hererrrrrrr")
    var emailToSend = await userModel.find({ _id: payment.transactions[0].description }).select('email -_id')
    var mailOptions = {
        from: 'backendtlcn@gmail.com',
        to: emailToSend[0].email,
        subject: 'Sending Email using Node.js',
        html: subHtml
    };
    console.log(emailToSend)
    console.log("done to hererrrrrrr 2")
    return await new Promise((resolve, reject) => {
        emailProvider.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(false);
            } else {
                console.log(info)
                resolve(true);
            }
        })
    });
}
export default { sendOTPMail, sendHttpMailBcc, sendCreateAccountPass, sendInvoice }