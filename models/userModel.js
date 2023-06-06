const mongoose = require("mongoose")
const Joi=require("joi")
const jwt=require("jsonwebtoken")
const {config} =require("../config/secret") 



const userSchema = new mongoose.Schema({
    name: String,  
    email:String,
    pass:String,
    date_created:{
        type:Date, default:Date.now()
    },
    role:{
        type:String, default:"user"
    }

});


exports.UserModel=mongoose.model("users",userSchema)

exports.getToken=(_userId,_role)=>{
    let token=jwt.sign({_id:_userId,role:_role},config.tokenSecret,{expiresIn:"60mins"});
    return token;
}

exports.validUser=(_bodyData)=>{
    let joiSchema=Joi.object({
        name:Joi.string().min(2).max(99).required(),
        email:Joi.string().min(5).max(30).required().email(),
        pass:Joi.string().min(4).max(15).required()
    })
    return joiSchema.validate(_bodyData)
}


exports.validLogin=(_bodyData)=>{
    let joiSchema=Joi.object({
        email:Joi.string().min(5).max(30).required().email(),
        pass:Joi.string().min(4).max(15).required()
    })
    return joiSchema.validate(_bodyData)
}