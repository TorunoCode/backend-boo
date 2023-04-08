import emailProvider from '../config/nodeMailer.js';
import fileHandle from './fileHandle.js';
async function sendOTPMail(OTP, mail) {
    var subHtml = fileHandle.template4Notification("Ma OTP cua ban la: " + OTP)
    var mailOptions = {
        from: 'backendtlcn@gmail.com',
        to: mail,
        subject: 'OTP verify',
        html: subHtml
    };
    const result = await new Promise((resolve, reject) => {
        emailProvider.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.status(400).send(error);
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
                res.status(400).send(error);
                reject(error);
            } else {
                resolve(info);
            }
        })
    });
    return result
}
export default { sendOTPMail, sendHttpMailBcc }