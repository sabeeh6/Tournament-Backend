import { Ground } from "../model/grounds.js";


export const createGround = async(req , res)=>{
    try {
        const {groundName , status } = req.body
        const userId = req.user._id
         await Ground.create({groundName , status , userId});

        return res.status(200).json({
            success:true,
            Data:{
                Name:groundName,
                status:status,
                userId:userId
            }
        })
        
    } catch (error) {
        console.log("Error" , error);
        return res.status(500).json({
            success:false,
            message:"Internal Server error"
        })
    }
}
