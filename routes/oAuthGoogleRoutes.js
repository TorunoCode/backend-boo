import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import UserModal from '../models/userModel.js';
import https from 'https';
import stringHandle from '../commonFunction/stringHandle.js';
import emailHandle from '../commonFunction/emailHandle.js';
import getDataHandle from '../commonFunction/getDataHandle.js';
import bcrypt from 'bcryptjs';
import user from '../routeFunction/user.js';
const app = express.Router();
app.get("/", async (req, res) => {
    res.send({ message: "api/oAuthGoogleRoutes/Signup" })
})
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
let DB = [];

async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        return { payload: ticket.getPayload() };
    } catch (error) {
        return { error: "Invalid user detected. Please try again" };
    }
}
async function verifyGoogleAccessToken(token) {
    let dataToUse =
        getDataHandle.getJsonData
            ('www.googleapis.com', 443,
                '/oauth2/v3/userinfo?alt=json&access_token=' + token, 'GET')
    return dataToUse;
}

// server.js
app.post("/login", async (req, res) => {
    try {
        let profile, verificationResponse;
        if (req.body.tokenId) {
            verificationResponse = await verifyGoogleToken(req.body.tokenId);
            profile = verificationResponse?.payload;
        }
        /*if (profile == null) {
            verificationResponse = await verifyGoogleAccessToken(req.body.access_token);
            if (verificationResponse.error) {
                return res.status(400).json({
                    message: verificationResponse.error,
                });
            }
            profile = verificationResponse
        }*/
        let existsInDB = await user.updateUserInfoAfterVerifyLogin(profile?.email, profile?.name, profile?.given_name, profile?.picture)
        if (existsInDB.message) {
            return res.status(404).send({ data: null, message: existsInDB.message })
        }
        if (existsInDB.isAdmin) { req.session.isAdmin = true; }
        req.session.isAuth = true;
        return res.status(200).json({ data: existsInDB });
        //return res.status(400).json({ data: null, message: "Not Found login token" })
    } catch (error) {
        res.status(500).json({
            message: error?.message || error,
        });
    }
});
export default app;