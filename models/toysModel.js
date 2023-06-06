const mongoose = require("mongoose")
const Joi=require("joi")
const toySchema = new mongoose.Schema({
    name: String,
    info:String,
    category:String,
    img_url: String,
    price: Number,
    date_created:{
        type:Date, default:Date.now()
    },
    user_id:String
})

exports.ToyModel=mongoose.model("toys",toySchema)

exports.validToy=(_bodyData)=>{
    let joiSchema=Joi.object({
        name:Joi.string().min(2).required(),
        info:Joi.string().min(10).required(),
        category:Joi.string().min(2).required(),
        img_url:Joi.string().min(5).max(200).required(),
        price:Joi.number().min(0).max(500).required(),
        user_id:Joi.string().required()
    })
    return joiSchema.validate(_bodyData)
}