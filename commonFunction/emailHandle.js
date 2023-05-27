import emailProvider from '../config/nodeMailer.js';
import fileHandle from './fileHandle.js';
import userModel from '../models/userModel.js';
async function sendOTPMail(OTP, mail) {
    var subHtml = fileHandle.template4Notification("Your forgot password OTP: " + OTP)
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
    var subHtml = fileHandle.template4Notification("Account: " + mail + " created with password: " + password)
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
async function sendInvoice(paymentId, idUser, movie, cinema, date, session, seat, billsOfUser, total_for_execute, dateOrder) {
    let subHtml = fileHandle.invoice(paymentId, movie, cinema, date, session, seat, billsOfUser, total_for_execute, dateOrder)
    var emailToSend = await userModel.find({ _id: idUser }).select('email -_id')
    var mailOptions = {
        from: 'backendtlcn@gmail.com',
        to: emailToSend[0].email,
        subject: 'Sending Email using Node.js',
        html: subHtml
    };
    return await new Promise((resolve, reject) => {
        emailProvider.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(false);
            } else {
                resolve(true);
            }
        })
    });
}
export default { sendOTPMail, sendHttpMailBcc, sendCreateAccountPass, sendInvoice }