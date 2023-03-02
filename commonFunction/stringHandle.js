import bcrypt from 'bcryptjs';
function randomString() {
    let rand = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        rand += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return rand
}
function compareBcrypt(bcrypte, bcrypteCompared) {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(bcrypteCompared, bcrypte, function (err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}
export default { randomString, compareBcrypt };