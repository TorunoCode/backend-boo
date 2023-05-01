import queryString from 'query-string';
import https from 'https';
import express from 'express';
import UserModal from '../models/userModel.js';
import stringHandle from '../commonFunction/stringHandle.js';
import emailHandle from '../commonFunction/emailHandle.js';
import getDataHandle from '../commonFunction/getDataHandle.js';
import bcrypt from 'bcryptjs';
const app = express.Router();
//https://graph.facebook.com/debug_token?
//input_token = EAAIpHBi8doYBAPqZCZCAJCgNKEgoVRBbSghsusagJZCZA5D9y0k95aguLkLHfWtjV7QcVJSeJzIYn2IhpajRfrfaaVbMPCinLHCEjyyI4XTZAZBwlKDlyL16BvKs4SyAUC5CEvRS4KRWGCRaGuiFuB6n7cAXLm6CjBbA6csQuj3ZBBxqYtcXSAyeHv8zwrBoj7GYslaDQfOZC1t0dLLMhxezpS49lGrC4KJcwom8MyxyrZB1zCGHTUZCFm 
//& access_token=608150604248710 | oJo9VAaZ1vktIKbWNS0epeLeEyg
app.post("/login", async (req, res) => {
    try {
        console.log("login here")
        console.log(req.body.accessToken)
        console.log(req.body.id)
        if (req.body.accessToken || req.body.id) {
            //"https://graph.facebook.com/v16.0/me?fields=id%2Cname%2Cemail&access_token="
            const urlSendToFacebook = 'https://graph.facebook.com/v16.0/' + req.body.id + '?access_token=' + req.body.accessToken + '&fields=name,email,picture';
            //https.globalAgent.options.secureProtocol = 'SSLv3_method';
            // let dataToUse = getDataHandle.getJsonData('backend-boo.vercel.app', null, '/api/paypal/test2/mail', 'GET')
            const options = {
                hostname: 'backend-boo.vercel.app',
                path: '/api/paypal/test2/mail',
                method: 'GET'
            };
            let dataToUse = await new Promise((resolve, reject) => {
                https.get(urlSendToFacebook, (resp) => {
                    let data = '';

                    // A chunk of data has been received.
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });

                    // The whole response has been received. Print out the result.
                    resp.on('end', () => {
                        console.log("i am here")
                        console.log(JSON.parse(data));
                        resolve(JSON.parse(data));
                    });

                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                    reject(err)
                });
            });
            console.log("test")
            console.log(dataToUse)
            if (dataToUse.error) {
                return res.send({ message: dataToUse.error?.message || dataToUse.error })
            }
            console.log(dataToUse)
            if (dataToUse.email != '') {
                const profile = { 'email': dataToUse.email, 'name': dataToUse.name, 'picture': dataToUse.picture.data.url };
                console.log(profile)
                let existsInDB = await UserModal.findOne({ email: profile?.email });

                if (!existsInDB) {
                    let randPass = stringHandle.randomString()
                    const UserModalCreated = await UserModal.create({
                        email: profile?.email, password: await bcrypt.hash(randPass, 12), name: profile?.name, pin: "",
                        isActive: true, isAdmin: false, fullName: profile?.name,
                        avatar: profile?.picture
                    });
                    await emailHandle.sendCreateAccountPass(randPass, profile?.email)
                    return res.status(201).send({ data: UserModalCreated });
                }
                if (existsInDB.isActive == false)
                    return res.status(404).send({ data: null, message: "User is still block" });
                if (existsInDB.isAdmin) { req.session.isAdmin = true; }
                req.session.isAuth = true;
                if (existsInDB && existsInDB.avatar == '') {
                    existsInDB = await UserModal.findOneAndUpdate({ _id: existsInDB._id }, { avatar: profile?.picture }, {
                        new: true
                    })
                }
                if (existsInDB && existsInDB.fullName == '') {
                    existsInDB = await UserModal.findOneAndUpdate({ _id: existsInDB._id }, { fullName: profile?.given_name }, {
                        new: true
                    })
                }
                return res.status(200).send({ data: existsInDB });
            }
            else {
                console.log(dataToUse.name)
                console.log(dataToUse.picture.data.url)
                console.log(dataToUse)
                return res.status(400).send({ data: null, message: "your token incorrect or you don't public your email" })
            }
        }
        return res.status(400).send({ data: null, message: "Not Found login token" })
    } catch (error) {
        res.status(500).send({
            message: error?.message || error,
        });
    }
});
export default app;