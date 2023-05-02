import UserModal from '../models/userModel.js';
import stringHandle from '../commonFunction/stringHandle.js';
import bcrypt from 'bcryptjs'
import emailHandle from '../commonFunction/emailHandle.js';
async function updateUserInfoAfterVerifyLogin(email, name, given_name, picture) {
    let existsInDB = await UserModal.findOne({ email: email });
    console.log(existsInDB)
    if (!existsInDB) {
        let randPass = stringHandle.randomString()
        const UserModalCreated = await UserModal.create({
            email: email, password: await bcrypt.hash(randPass, 12), name: name, pin: "",
            isActive: true, isAdmin: false, fullName: given_name,
            avatar: picture
        });
        await emailHandle.sendCreateAccountPass(randPass, email)
        return UserModalCreated
    }
    if (existsInDB.isActive == false)
        return { message: "User is still block" };

    if (existsInDB && existsInDB.avatar == "") {
        existsInDB = await UserModal.findOneAndUpdate({ _id: existsInDB._id }, { avatar: picture }, {
            new: true
        })
    }
    if (existsInDB && existsInDB.fullName == "") {
        existsInDB = await UserModal.findOneAndUpdate({ _id: existsInDB._id }, { fullName: given_name }, {
            new: true
        })
    }
    console.log("here")
    console.log(existsInDB)
    return existsInDB;
}
export default { updateUserInfoAfterVerifyLogin }