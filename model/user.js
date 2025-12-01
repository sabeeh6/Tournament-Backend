    import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String
    },
    role:{
        type:String,
        enum:["user" , "organizor" , "admin"],
        default:"user"
    },
    password:{
        type:String
    },
    streetAddress:{
        type:String,
        trim: true,
    },
    address:{
        type:String,
        trim: true,
    },
    state:{
        type:String,
        trim: true,
    },
    zipcode: {
        type: Number,
        min: [10000, "Invalid zipcode"],
        max: [999999, "Invalid zipcode"],
    },
    number:{
        type:Number
    }
},{
    timestamps:true,
})
export const User = mongoose.model("user" , userSchema) 