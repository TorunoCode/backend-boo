import dotenv from 'dotenv'
dotenv.config();
import queryString from 'query-string';
import https from 'https';
import express from 'express';
import UserModal from '../models/userModel.js';
import stringHandle from '../commonFunction/stringHandle.js';
import emailHandle from '../commonFunction/emailHandle.js';
import getDataHandle from '../commonFunction/getDataHandle.js';
import user from '../routeFunction/user.js';
import bcrypt from 'bcryptjs';
const app = express.Router();
//const FACEBOOK_APP_TOKEN = "743911623614504|2OaFMKHCocRdCywhmY8Ha9vzPV8";
//const FACEBOOK_APP_TOKEN2 = "1620897148361329|Q78S4BaMN5TPM3HRrLlk2iCq5j4"
const FACEBOOK_APP_TOKEN = process.env.FACEBOOK_APP_TOKEN
//608150604248710|oJo9VAaZ1vktIKbWNS0epeLeEyg
app.get("/", async (req, res) => {
    res.send({ message: "api/oAuthFacebookRoutes/Signup" })
})
//https://graph.facebook.com/debug_token?
//input_token = EAAIpHBi8doYBAPqZCZCAJCgNKEgoVRBbSghsusagJZCZA5D9y0k95aguLkLHfWtjV7QcVJSeJzIYn2IhpajRfrfaaVbMPCinLHCEjyyI4XTZAZBwlKDlyL16BvKs4SyAUC5CEvRS4KRWGCRaGuiFuB6n7cAXLm6CjBbA6csQuj3ZBBxqYtcXSAyeHv8zwrBoj7GYslaDQfOZC1t0dLLMhxezpS49lGrC4KJcwom8MyxyrZB1zCGHTUZCFm
//& access_token=743911623614504|2OaFMKHCocRdCywhmY8Ha9vzPV8
async function verifyFacebookAccessToken(input_token) {
    let dataToUse = getDataHandle.getJsonDataUrl
        ('https://graph.facebook.com/debug_token?input_token='
            + input_token + '&access_token=' + FACEBOOK_APP_TOKEN)
    return dataToUse
}
app.post("/login", async (req, res) => {
    try {
        console.log("login here")
        console.log(req.body.accessToken)
        console.log(req.body.id)
        if (!req.body.accessToken || !req.body.id)
            return res.status(400).send({ data: null, message: "Not Found login token" })
        let verifyFacebookToken = await verifyFacebookAccessToken(req.body.accessToken)
        if (verifyFacebookToken.error)
            return res.status(400).json({
                message: verifyFacebookToken.error.message,
            });
        const urlSendToFacebook = 'https://graph.facebook.com/v16.0/' + req.body.id + '?access_token=' + req.body.accessToken + '&fields=name,email,picture';
        let dataToUse = await getDataHandle.getJsonDataUrl(urlSendToFacebook)
        if (dataToUse.error) {
            return res.send({ message: dataToUse.error?.message || dataToUse.error })
        }
        console.log(dataToUse)
        if (dataToUse.email == '') {
            console.log(dataToUse.name)
            console.log(dataToUse.picture.data.url)
            console.log(dataToUse)
            return res.status(400).send({ data: null, message: "You didn't public your email" })
        }
        const profile = { 'email': dataToUse.email, 'name': dataToUse.name, 'picture': dataToUse.picture.data.url };
        console.log(profile)
        let existsInDB = await user.updateUserInfoAfterVerifyLogin(dataToUse.email, dataToUse.name, dataToUse.name, dataToUse.picture.data.url)
        if (existsInDB.message) {
            return res.status(400).send({ data: null, message: existsInDB.message })
        }
        if (existsInDB.isAdmin)
            req.session.isAdmin = true;
        req.session.isAuth = true;
        req.session.userEmail = existsInDB.email;
        req.session.userId = existsInDB.id
        req.session.save()
        return res.status(200).send({ data: existsInDB });


    } catch (error) {
        res.status(500).send({
            message: error?.message || error,
        });
    }
});
export default app;