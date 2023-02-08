import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import UserModal from '../models/userModel.js';
import User from '../models/userModel.js';
const app = express.Router();
app.get("/", async (req, res) => {
    res.send({ message: "api/oAuthGoogleRoutes/Signup" })
})
const GOOGLE_CLIENT_ID = "475445624769-n5bdbpqcobh1n28trk88lnjnb55b669f.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
let DB = [];

async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        console.log("done here")
        return { payload: ticket.getPayload() };
    } catch (error) {
        console.log(GOOGLE_CLIENT_ID)
        console.log(error)
        return { error: "Invalid user detected. Please try again" };
    }
}
app.post("/Signup", async (req, res) => {
    try {
        // console.log({ verified: verifyGoogleToken(req.body.credential) });
        console.log("tohere")
        if (req.body.credential) {
            const verificationResponse = await verifyGoogleToken(req.body.credential);

            if (verificationResponse.error) {
                return res.status(400).json({
                    message: verificationResponse.error
                });
            }

            const profile = verificationResponse?.payload;
            console.log(profile?.email)
            const oldUser = await UserModal.findOne({ email: profile?.email });
            if (!oldUser) {
                const email = profile?.email;
                const given_name = profile?.given_name;
                const data = await UserModal.create({
                    email: email, password: "", name: given_name, pin: "",
                    isActive: true, isAdmin: false, fullName: profile?.family_name + profile?.given_name
                })
            }

            res.status(201).json({
                message: "Signup was successful",
                user: {
                    firstName: profile?.given_name,
                    lastName: profile?.family_name,
                    picture: profile?.picture,
                    email: profile?.email,
                    token: jwt.sign({ email: profile?.email }, "myScret", {
                        expiresIn: "1d",
                    }),
                },
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error
        });
    }
});
// server.js
app.post("/login", async (req, res) => {
    try {
        console.log("login here")
        if (req.body.credential) {
            const verificationResponse = await verifyGoogleToken(req.body.credential);
            if (verificationResponse.error) {
                return res.status(400).json({
                    message: verificationResponse.error,
                });
            }

            const profile = verificationResponse?.payload;

            const existsInDB = await UserModal.findOne({ email: profile?.email });

            if (!existsInDB) {
                return res.status(400).json({
                    message: "You are not registered. Please sign up",
                });
            }

            res.status(201).json({
                message: "Login was successful",
                user: {
                    firstName: profile?.given_name,
                    lastName: profile?.family_name,
                    picture: profile?.picture,
                    email: profile?.email,
                    token: jwt.sign({ email: profile?.email }, process.env.JWT_SECRET, {
                        expiresIn: "1d",
                    }),
                },
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error?.message || error,
        });
    }
});
export default app;