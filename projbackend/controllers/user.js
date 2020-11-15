const User = require("../models/user")
const Order = require("../models/order")
const product = require("../models/product")

//custom middle ware to get customer unique id
exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((error, user) => {
        if(error || !user){
            return res.status(403).json({
                error : "No user Found!"
            })
        }

        req.profile = user;
        next();
    })
}

exports.getUser = (req,res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
}

exports.updateData = (req,res) => {
    User.findByIdAndUpdate(
        {_id : req.profile._id},
        {$set : req.body},
        {new : true, useFindAndModify : false},
        (error,user) => {
            if(error){
                return res.status(403).json({
                    error : "You are not Authorized!"
                })
            }
            user.encry_password = undefined;
            user.salt = undefined;
            res.json(user)
        }

    )
}

exports.userPurchaseList = (req,res) => {
    Order.find({user : req.profile._id})
         .populate("user", "_id name email")
         .exec((error,order) => {
             if(error || !order){
                 return res.status(403).json({
                     error : "NO Product Found!"
                 })
             }
             return res.json(order)
         })
}


//middle ware 

exports.pushOrderInpurchaseList = (req,res,next) => {
    let purchases = [];
    console.log(req.body.order.products);
    req.body.order.products.forEach(product => {
        purchases.push({
            _id : product._id,
            name : product._name,
            description : product.description,
            category : product.category,
            quantity : product.quantity,
            amount : req.body.order.amount,
            transaction_id : req.body.order.transaction_id
        })
    });

    User.findOneAndUpdate(
        { _id : req.profile._id},
        { $push : {purchases : purchases}},
        {new : true}, //this is imply telling give me updated object not previous one
        (error, purchases) => {
            if(error || !purchases){
                return res.status(400).json({
                    error : "Something went wrong ! please try again"
                })
            }
            next();
        }
    )
}