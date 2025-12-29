import mongoose from "mongoose";


const groundSchema = new mongoose.Schema({

    groundName:{
        type: String
    },
    groundOwner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["Booked" , "Avaliable" , "Unavaliable"],
        default:"Avaliable"
    },
    type:{
        type:String,
        enum:["Crikect" , "Football" , "Tennis" , "Basketball" , "Badminton"],
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    images:{
        type:String
    },
    description:{
        type:String
    },
    bookingSlots: [{
    date: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }]

})

export const Ground = mongoose.model("ground" , groundSchema);
