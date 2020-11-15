//importing the mongoose
var mongoose = require("mongoose")

const crypto = require('crypto')

const uuidv1 = require('uuid/v1');
// creating the schema 
var schema = mongoose.Schema;

var userSchema = new schema({
    name : {
        type : String,
        required : true,
        maxlength : 32,
        trim : true
    },
    lname : {
        type : String,
        maxlength : 32,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    encry_password : {
        type : String,
        minlength : 6,
        required : true
    },
    salt : String,
    role : {
        type : Number,
        default : 0,
    },
    purchase : {
        type : Array,
        default : []
    }
},{timestamps : true})


userSchema.virtual('password')
    .set(function(password){
        // underscore declare the variable as private 
        this._password = password;
        this.salt = uuidv1();
        this.encry_password = this.securePaasword(password);
    })
    .get(function(){
        return this._password;
    })

//methods in schema 

userSchema.methods = {
    securePaasword : function(plainpassword){
        if(!plainpassword) return "";
        try {
            return crypto.createHmac('sha256', this.salt)
            .update(plainpassword)
            .digest('hex');
        } catch (error) {
            return "";
        }
    },
    authenticate : function(plainpassword){
        return this.securePaasword(plainpassword) === this.encry_password ? true : false
    }
}


module.exports = mongoose.model("User", userSchema)