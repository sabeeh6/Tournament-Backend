import { User, Organizor } from "../model/user.js";
import bcrypt from "bcrypt";

export const createOrganizor = async (req, res) => {
  try {
    const { name, email, password, address, state, zipCode, number } = req.body
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({
        success: false,
        message: "Organizor already exist"
      })
    }
    const hashPass = await bcrypt.hash(password, 10)
    const role = "organizor"
    const newOrganizor = {
      name, email, password: hashPass, address, state, zipCode, number, role
    }
    const createdOrganizor = await Organizor.create(newOrganizor);

    return res.status(201).json({
      success: true,
      message: "Organizor created successfully",
      data: createdOrganizor
    });


  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
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

export const getOrganizor = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments({ role: "organizor" });
    const organizorsRaw = await User.find({ role: "organizor" })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const organizors = organizorsRaw.map(org => {
      if (!org.status) {
        org.status = "inactive";
      }
      return org;
    });

    return res.status(200).json({
      success: true,
      message: "Organizors fetched successfully",
      data: organizors,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
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
