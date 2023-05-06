import express from 'express';
import UserModal from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import stringHandle from '../commonFunction/stringHandle.js';
import emailHandle from '../commonFunction/emailHandle.js';
import timeHandle from '../commonFunction/timeHandle.js';
const app = express.Router();

app.post("/forgotpassword", async function (req, res) {
    let RandOTP = stringHandle.randomString();
    console.log(RandOTP)
    let user = await UserModal.findOneAndUpdate({ email: req.body.email }, { OTP: RandOTP, timeCreatedOTP: Date.now() }, { new: true })
    if (!user)
        return res.status(400).json({ message: "Can't find your email" });
    //timeHandle.checkTimeDifferenceMinute(user.timeCreatedOTP, Date.now())
    let result = await emailHandle.sendOTPMail(user.OTP, user.email);
    if (!result)
        return res.status(400).json({ message: result.error });
    return res.status(200).json({ message: "Sended OTP to your email!" });

});
app.post("/forgotpasswordchangepass", async function (req, res) {
    let user = await UserModal.find({ email: req.body.email, OTP: req.body.OTP })
    console.log(user)
    if (user[0] == null)
        return res.status(400).json({ message: "Error OTP" });
    if (timeHandle.checkTimeDifferenceMinute(user[0].timeCreatedOTP, Date.now()) > 5)
        return res.status(400).json({ message: "OTP time out" });

    console.log(req.body.newpassword)
    user = await UserModal.findOneAndUpdate({ email: req.body.email }, { OTP: "", password: await bcrypt.hash(req.body.newpassword, 12), timeCreatedOTP: null })
    if (!user)
        return res.status(400).json({ message: "Error updating your password" });
    return res.status(200).json({ message: "Change password success" });
})
app.post("/changepass", async function (req, res) {
    let user = await UserModal.findOne({ email: req.body.email })
    const isPasswordCorrect = await stringHandle.compareBcrypt(user.password, req.body.oldpassword);
    if (!isPasswordCorrect)
        return res.status(400).json({ message: "Wrong password!" });
    user = await UserModal.findOneAndUpdate({ email: req.body.email }, { password: await bcrypt.hash(req.body.newpassword, 12) })
    if (!user)
        return res.status(400).json({ message: "Error updating your password" });
    return res.status(200).json({ message: "Change password success" });
})
export default app;
