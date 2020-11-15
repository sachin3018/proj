// module.export for only one time and exports. only for more then one time
const User = require("../models/user")
const { validationResult } = require('express-validator')
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signup = (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg,
            param : errors.array()[0].param
        })
    }

    const user = new User(req.body);
    user.save((err,user) => {
        if(err){
            return res.status(400).json({
                error : "NOT available "
            })
        }
        res.json({
            name : user.name,
            email : user.email,
            id : user._id
        });
   })
}

exports.signin = (req,res) => {
    const { email, password} = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg,
            component : errors.array()[0].param,
        })
    }

    User.findOne({email}, (error,user) => {
        if(error ){
            return res.status(400).json({
                error : "Email not found"
            })
        }

        if(!user){
            return res.status(400).json({
                error : "Sorry you need to sign up first !"
            })
        }


        if(!user.authenticate(password)){
            return res.status(401).json({
                error : "Email or Password Incorrect"
            })
        }

        //genrating token
        const token = jwt.sign({ _id : user._id},process.env.SECRET);

        //setting to browser cookie
        res.cookie("token",token,{expire : new Date() + 9999});

        //send response to the front end part
        const {name,email,_id,role} = user;
        return res.json({ token , user : {_id, email, name, role}})

    })
}

exports.signout = (req,res) => {
    res.clearCookie("token")
    res.json({
        message : "Signout Succesful"
    })
}



//protect the route

exports.isSignedIn = expressJwt({
    secret : process.env.SECRET,
    userProperty : "auth"
})

//custom middle-ware

exports.isAuthenticate = (req,res,next) => {
    const checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error : "ACCESS DENIED"
        })
    }
    next();
}

exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error : "Permission Denied! Not an ADMIN"
        })
    }
    next();
}