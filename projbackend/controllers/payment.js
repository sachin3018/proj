const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "z3zj7cy882bc28tg",
  publicKey: "9yx4nq8rm38ddrvz",
  privateKey: "152bd81bcfa4b6747e9c93074791a914"
});



exports.getToken = (req, res) => {
    //
    gateway.clientToken.generate({}, (err, response) => {
        if(err){
            res.status(500).send(err);
        }else{
            res.send(response);
        }
    });
}

exports.proceedPayment = (req, res) => {

    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromClient = req.body.amount;
    //console.log(nonceFromTheClient)
    gateway.transaction.sale({
        amount: amountFromClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
            submitForSettlement: true
        }
        }, (err, result) => {
            if(err){
                res.status(500).send(err);
            }else{
              
                res.send(result);
            }
        });
}