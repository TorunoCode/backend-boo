import queryString from 'query-string';
import https from 'https';
import express from 'express';
import UserModal from '../models/userModel.js';
const app = express.Router();
app.post("/login", async (req, res) => {
    try {
        console.log("login here")
        if (req.body.accessToken) {
            //"https://graph.facebook.com/v16.0/me?fields=id%2Cname%2Cemail&access_token="
            const urlSendToFacebook = 'https://graph.facebook.com/v16.0/me?access_token=' + req.body.accessToken + '&fields=name,email,picture';
            //https.globalAgent.options.secureProtocol = 'SSLv3_method';
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
                    const UserModalCreated = await UserModal.create({
                        email: profile?.email, password: "", name: profile?.name, pin: "",
                        isActive: true, isAdmin: false, fullName: profile?.name,
                        avatar: profile?.picture
                    });
                    return res.status(201).json({ data: UserModalCreated });
                }
                if (existsInDB.isActive == false)
                    return res.status(404).json({ data: null, message: "User is still block" });
                if (existsInDB.isAdmin) { req.session.isAdmin = true; }
                req.session.isAuth = true;
                if (existsInDB & existsInDB.avatar == '') {
                    existsInDB = await UserModal.findOneAndUpdate({ _id: existsInDB._id }, { avatar: profile?.picture }, {
                        new: true
                    })
                }
                if (existsInDB & existsInDB.fullName == '') {
                    existsInDB = await UserModal.findOneAndUpdate({ _id: existsInDB._id }, { fullName: profile?.given_name }, {
                        new: true
                    })
                }
                return res.status(200).json({ data: existsInDB });
            }
            else {
                console.log(dataToUse.name)
                console.log(dataToUse.picture.data.url)
                console.log(dataToUse)
                return res.status(400).json({ data: null, message: "your token incorrect or you don't public your email" })
            }
        }
        return res.status(400).json({ data: null, message: "Not Found login token" })
    } catch (error) {
        res.status(500).json({
            message: error?.message || error,
        });
    }
});
export default app;