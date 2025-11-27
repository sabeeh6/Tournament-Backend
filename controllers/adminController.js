import { success } from "zod";
import { User } from "../model/user";

export const getCompanies = async(req , res)=>{
    try {
        const company = await User.find({role : "company"})
        console.log("Company" , company);
        if (!company) {
            return res.status(404).json({
                success:false,
                message:"Company not found"
            })
        }
        
return res.status(200).json({
    success:true,
    message:company
})
        
    } catch (error) {
        console.error("Error" , error);
        return res.status(500).json({message:"Interna server error"})
    }
}

export const inactivateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await User.findOne({ _id: id, role: "company" });
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    company.status = "inactive"; 
    await company.save();

    return res.status(200).json({
      success: true,
      message: "Company status updated to inactive",
      data: company,
    });
  } catch (error) {
    console.error("Error inactivating company:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const activateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await User.findOne({ _id: id, role: "company" });
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    company.status = "active"; 
    await company.save();

    return res.status(200).json({
      success: true,
      message: "Company status updated to active",
      data: company,
    });
  } catch (error) {
    console.error("Error activating company:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
