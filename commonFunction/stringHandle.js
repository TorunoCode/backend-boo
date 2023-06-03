import bcrypt from 'bcryptjs';
function GetSortOrder(prop) {
    return function (a, b) {
        if (a[prop] < b[prop]) {
            return 1;
        } else if (a[prop] > b[prop]) {
            return -1;
        }
        return 0;
    }
}
function GetSortOrderDecrese(prop) {
    return function (a, b) {
        let aTest = Number(a[prop].substring(1))
        let bTest = Number(b[prop].substring(1))
        if (aTest > bTest) {
            return 1;
        } else if (aTest < bTest) {
            return -1;
        }
        return 0;
    }
}
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
export default { randomString, compareBcrypt, GetSortOrder, GetSortOrderDecrese };