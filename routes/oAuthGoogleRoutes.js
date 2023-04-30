import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import UserModal from '../models/userModel.js';
import https from 'https';
import stringHandle from '../commonFunction/stringHandle.js';
import emailHandle from '../commonFunction/emailHandle.js';
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
    const options = {
        hostname: 'www.googleapis.com',
        port: 443,
        path: '/oauth2/v3/userinfo?alt=json&access_token=' + token,
        method: 'GET',
    };
    let dataToUse = await new Promise((resolve, reject) => {
        https.get(options, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                resolve(JSON.parse(data));
            });

        }).on("error", (err) => {
            reject(err)
        });
    });
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
        if (profile == null) {
            verificationResponse = await verifyGoogleAccessToken(req.body.access_token);
            if (verificationResponse.error) {
                return res.status(400).json({
                    message: verificationResponse.error,
                });
            }
            profile = verificationResponse
        }
        let existsInDB = await UserModal.findOne({ email: profile?.email });

        if (!existsInDB) {
            let randPass = stringHandle.randomString()
            const UserModalCreated = await UserModal.create({
                email: profile?.email, password: await bcrypt.hash(randPass, 12), name: profile?.name, pin: "",
                isActive: true, isAdmin: false, fullName: profile?.given_name,
                avatar: profile?.picture
            });
            await emailHandle.sendCreateAccountPass(randPass, profile?.email)
            return res.status(201).json({ data: UserModalCreated });
        }
        if (existsInDB.isActive == false)
            return res.status(404).json({ data: null, message: "User is still block" });
        if (existsInDB.isAdmin) { req.session.isAdmin = true; }
        req.session.isAuth = true;
        if (existsInDB && existsInDB.avatar == "") {
            existsInDB = await UserModal.findOneAndUpdate({ _id: existsInDB._id }, { avatar: profile?.picture }, {
                new: true
            })
        }
        if (existsInDB && existsInDB.fullName == "") {
            existsInDB = await UserModal.findOneAndUpdate({ _id: existsInDB._id }, { fullName: profile?.given_name }, {
                new: true
            })
        }
        return res.status(200).json({ data: existsInDB });
        //return res.status(400).json({ data: null, message: "Not Found login token" })
    } catch (error) {
        res.status(500).json({
            message: error?.message || error,
        });
    }
});
export default app;