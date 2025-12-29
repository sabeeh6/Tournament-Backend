import { success } from "zod";
import { Ground } from "../model/grounds.js";


export const createGround = async(req , res)=>{
    try {
        const {groundName , status , type , price , description , location  } = req.body
        
        const userId = req.user._id
        if (!userId) {
            return res.status(404).json({success:false , message:"User Id not found"})
        }
        const ground = new Ground({
            groundName,
            groundOwner:userId,
            status,
            type,
            price,
            description,
            location
        })
        await ground.save()

        return res.status(201).json({
            success:true,
            Data:ground
        })
        
    } catch (error) {
        console.log("Error" , error);
        return res.status(500).json({
            success:false,
            message:"Internal Server error"
        })
    }
}

export const updateGround = async (req, res) => {
  try {
    const { id } = req.params;

    const ground = await Ground.findById(id);

    if (!ground) {
      return res.status(404).json({
        success: false,
        message: "Ground not found"
      });
    }

    // ✅ Update only provided fields
    const { groundName, status, type, price, description } = req.body;

    if (groundName !== undefined) ground.groundName = groundName;
    if (status !== undefined) ground.status = status;
    if (type !== undefined) ground.type = type;
    if (price !== undefined) ground.price = price;
    if (description !== undefined) ground.description = description;

    await ground.save();

    return res.status(200).json({
      success: true,
      message: "Ground updated successfully",
      data: ground
    });

  } catch (error) {
    console.error("Update Ground Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getGroundsById = async(req,res) => {
    try {
        const userId = req.user._id       
        const grounds = await Ground.find({groundOwner:userId})
        console.log("Ground" , grounds.length , grounds) ;
        if (!grounds) {
            return res.status(404).json({success:false , message:"Grounds not found"})
        }

        res.status(200).json({
            success:true,
            message:{
                Length:grounds.length,
                data:grounds
            }
        })
        
        
    } catch (error) {
        console.error("Error" , error);
        return res.status(500).json({success:false , message:"Internal server error"})
    }
}

export const delGround = async(req,res) => {
    try {
        const {id} = req.params
        const del = await Ground.findByIdAndDelete(id)
        if (!del) {
            return res.status(404).json({success:false , message:"Ground not found"})
        }

        res.status(200).json({
            success:true,
            message:"Ground deleted successfully 🙌"
        })
        
    } catch (error) {
        console.error("Error" , error);
        return res.status(500).json({success:false , message:"Internal server error"})
    }
}
