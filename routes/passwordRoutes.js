import express from 'express';
import UserModal from '../models/userModel.js';
import bcrypt from 'bcryptjs';
const app = express.Router();

app.get("/forgotpassword/:email", async (request, response) => {
    const user = await UserModal.find({ email: request.params.email })
    if (!user) {
        return res.status(404).json({ data: null, message: "User doesn't exist" });
    }
    if (oldUser.status == false) { return res.status(404).json({ data: null, message: "User is still block" }); }
    let rand = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        rand += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    let result = await UserModal.findOneAndUpdate({ email: request.params.email }, { checkChangePassword: rand })
    var subHtml = fs.readFileSync(path.join(path.resolve(process.cwd(), "template"), 'mailreceipt3.html'), 'utf8')

    return res.status(200).json({ data: null, message: "Sended to email" });
})
export default app;
