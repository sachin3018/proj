const {Order, ProductCart} = require("../models/order")


//get order by id
exports.getOrderByID = (req,res,next,id) => {
    Order.findById(id)
    .populate("products.product", "name price")
    .exec((error,order) => {
        if(error){
            return res.status(400).json({
                error : "No order Found!"
            })
        }
        req.order = order;
        next();
    })
}


//create a order
exports.createOrder = (req,res) => {
    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    order.save((error,ordersaving) => {
        if(error){
            return res.status(400).json({
                error : "Order Not Saved!"
            })
        }
        console.log(order)
        res.json(ordersaving)
    })
}


//get all order
exports.getAllOrder = (req,res) => {
    Order.find()
         .populate("user", "_id name")
         .exec((error,order) => {
            if(error){
                return res.status(400).json({
                    error : "Ooops No Order Found!"
                })
            }
            res.json(order);
         })
}

exports.updateOrderStatus = (req,res) => {
    Order.update(
        {_id : req.body.orderId},
        {$set : {status : req.body.status}},
        (error, order) => {
            if(error){
                return res.status(400).json({
                    error : "Update Failed!"
                })
            }
            res.json(order)
        }
    )
}

exports.getOrderStatus = (req,res) => {
    res.json(Order.schema.path("status").enumValues)
}