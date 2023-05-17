import paypal from 'paypal-rest-sdk'
function paypalPayout(email, money) {
    var sender_batch_id = Math.random().toString(36).substring(9);
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
                    "currency": "VND"
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
                reject(error)
            } else {
                resolve(payout)
            }
        });
    });
}
async function paypalCreate(returnUrl, cancelUrl, items, total, description) {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": returnUrl,
            "cancel_url": cancelUrl
        },
        "transactions": [{
            "item_list": {
                //tra mot luc nhieu ve
                //sku lay theo id
                //status = 0: trong qua trinh tra; status = 1: thanh toan roi; status=-1: chua tra
                // lay status = -1 xu ly roi gan = 0
                "items": items
            },
            "amount": {
                "currency": "USD",
                "total": total
            },
            "description": description
        }]
    };
    let paymentLink;
    return new Promise(function (resolve, reject) {
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                reject(error)
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        paymentLink = payment.links[i].href + ""
                        resolve(paymentLink)
                    }
                }
            }
        });
    });
}
export default { paypalPayout, paypalCreate }