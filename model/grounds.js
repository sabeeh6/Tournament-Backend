import mongoose from "mongoose";


const groundSchema = new mongoose.Schema({

    groundName:{
        type: String
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["Booked" , "Avaliable" , "Unavaliable"],
        default:"Avaliable"
    },
})

export const Ground = mongoose.model("ground" , groundSchema);
