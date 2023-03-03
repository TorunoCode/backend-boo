import paypal from 'paypal-rest-sdk'
function paypalPayout(email, money) {
    var sender_batch_id = Math.random().toString(36).substring(9);
    console.log(email)
    var create_payout_json = {
        "sender_batch_header": {
            "sender_batch_id": sender_batch_id,
            "email_subject": "You have a payment"
        },
        "items": [
            {
                "recipient_type": "EMAIL",
                "amount": {
                    "value": money,
                    "currency": "USD"
                },
                "receiver": email,
                "note": "Thank you.",
                "sender_item_id": "item_3"
            }
        ]
    };
    var sync_mode = 'false';
    return new Promise(function (resolve, reject) {
        paypal.payout.create(create_payout_json, function (error, payout) {
            if (error) {
                console.log(error.response);
                reject(error)
            } else {
                resolve(payout)
            }
        });
    });
}
export default { paypalPayout }