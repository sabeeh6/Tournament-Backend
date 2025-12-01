import { success } from "zod";
import { User } from "../model/user.js";
import bcrypt from "bcrypt";

export const createOrganizor = async(req,res) => {
    try {
      const {name , email , password ,  address , state , zip , number } = req.body
      const userExist = await User.findOne({email});
      if (userExist) {
        return res.status(409).json({
          success:false,
          message:"Organizor already exist"
        })
      }
      const hashPass= await bcrypt.hash(password , 10)
      const role = "organizor"
      const newOrganizor = {
        name , email , password: hashPass , address , state , zip , number , role
      }
      await User.create(newOrganizor);

      return res.status(201).json({
        success:true , 
        message:{
            name:name,
            email:email,
            address:address,
            state:state,
            zip:zip,
            number:number,
            role:role
            // image:image
        }
      })
      

    } catch (error) {
      console.error("Error" , error);
      return res.status(500).json({
        success:false,
        message:"Internal server error"
      })
    }
}

export const updateOrganizor = async (req, res) => {
  try {
    const { name, email, password, address, state, zip, number } = req.body;
    const { id } = req.params;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "Organizor not found with the provided ID"
      });
    }

    if (email && email !== userExist.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already exists"
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (address) updateData.address = address;
    if (state) updateData.state = state;
    if (zip) updateData.zip = zip;
    if (number) updateData.number = number;

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      updateData.password = hash;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password'); 

    return res.status(200).json({
      success: true,
      message: "Organizor updated successfully",
      data: updatedUser
    });

  } catch (error) {
    console.error("Error updating organizor:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getOrganizor = async(req , res)=>{
  // console.log('req',req)
    try {
        const organizor = await User.find({role : "organizor"});
        console.log("organizor" , organizor);
        if (organizor.length === 0) {
            return res.status(404).json({
                success:false,
                message:"Organizor not found"
            })
        }
        
return res.status(200).json({
    success:true,
    message:"Organizors get successfully",
    data:organizor
})
        
    } catch (error) {
        console.error("Error" , error);
        return res.status(500).json({message:"Internal server error"})
    }
}

export const inactivateOrganizor = async (req, res) => {
  try {
    const { id } = req.params;
    const organizor = await User.findOne({ _id: id, role: "organizor" });
    if (!organizor) {
      return res.status(404).json({
        success: false,
        message: "Organizor not found",
      });
    }

    organizor.status = "inactive"; 
    await organizor.save();

    return res.status(200).json({
      success: true,
      message: "Organizor status updated to inactive",
      data: organizor,
    });
  } catch (error) {
    console.error("Error inactivating organizor:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const activateOrganizor = async (req, res) => {
  try {
    const { id } = req.params;
    const organizor = await User.findOne({ _id: id, role: "organizor" });
    if (!organizor) {
      return res.status(404).json({
        success: false,
        message: "Organizor not found",
      });
    }

    organizor.status = "active"; 
    await organizor.save();

    return res.status(200).json({
      success: true,
      message: "Organizor status updated to active",
      data: organizor,
    });
  } catch (error) {
    console.error("Error activating organizor:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
