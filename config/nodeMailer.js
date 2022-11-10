
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
export default transporter;