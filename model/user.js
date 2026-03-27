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
    zipCode: {
        type: Number,
        min: [10000, "Invalid zipcode"],
        max: [999999, "Invalid zipcode"],
    },
    number:{
        type:Number
    }
},{
    timestamps:true,
    discriminatorKey: '_t'
})

export const User = mongoose.model("user" , userSchema) 

const organizorSchema = new mongoose.Schema({
     status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive",
    },
});
export const Organizor = User.discriminator("organizor", organizorSchema);
