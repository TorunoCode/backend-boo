
import nodeMailer from "nodemailer"
//gmail password: HcmuteTlcnBackEnd1
var transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'backendtlcn@gmail.com',
    pass: 'fstxqecwiffznvyt'
  },
  tls: {
    rejectUnauthorized: false
  }
});
/*var transporter = nodeMailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: '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'
  }
});*/
export default transporter;