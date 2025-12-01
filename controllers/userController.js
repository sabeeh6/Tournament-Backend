import logger from "../config/logger.js";
import { User } from "../model/user.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build filter query
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    // Execute query
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);

    logger.info("Users fetched successfully", {
      page,
      limit,
      total,
      count: users.length,
    });

    return res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasMore: skip + users.length < total,
        },
      },
    });
  } catch (error) {
    logger.error("Failed to fetch users", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    logger.debug("Fetching user by ID", { userId: id });

    const user = await User.findById(id).select("-password");

    if (!user) {
      logger.warn("User not found", { userId: id });
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    logger.info("User fetched successfully", { userId: id });

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Failed to fetch user", {
      error: error.message,
      userId: req.params.id,
    });

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, streetAddress, state, zipcode } =
      req.body;

    // logger.info("Creating new user", { email, role });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
    //   logger.warn("User creation failed: Email already exists", { email });
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      streetAddress,
      state,
      zipcode,
    });

    await user.save();

    // logger.info("User created successfully", { userId: user._id, email });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user: userResponse },
    });
  } catch (error) {
    // logger.error("User creation failed", { error: error.message });

    // if (error.name === "ValidationError") {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Validation failed",
    //     errors: Object.values(error.errors).map((e) => e.message),
    //   });
    // }

    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    logger.info("Updating user", { userId: id });

    // Remove fields that shouldn't be updated directly
    delete updates.password; // Use separate endpoint for password change
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    // Don't allow role change unless admin
    if (updates.role && req.user?.role !== "admin") {
      delete updates.role;
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      logger.warn("User update failed: User not found", { userId: id });
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    logger.info("User updated successfully", { userId: id });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: { user },
    });
  } catch (error) {
    logger.error("User update failed", {
      error: error.message,
      userId: req.params.id,
    });

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    logger.info("Deleting user", { userId: id });

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      logger.warn("User deletion failed: User not found", { userId: id });
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    logger.info("User deleted successfully", { userId: id });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: {
        deletedUser: {
          id: user._id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    logger.error("User deletion failed", {
      error: error.message,
      userId: req.params.id,
    });

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

export const bulkDeleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User IDs array is required",
      });
    }

    logger.info("Bulk deleting users", { count: userIds.length });

    const result = await User.deleteMany({ _id: { $in: userIds } });

    logger.info("Bulk delete completed", { deletedCount: result.deletedCount });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} users deleted successfully`,
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    logger.error("Bulk delete failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Failed to delete users",
      error: error.message,
    });
  }
};

export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    if (!["user", "organizor", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be user, organizor, or admin",
      });
    }

    logger.debug("Fetching users by role", { role });

    const users = await User.find({ role }).select("-password");

    logger.info("Users by role fetched", { role, count: users.length });

    return res.status(200).json({
      success: true,
      data: {
        role,
        count: users.length,
        users,
      },
    });
  } catch (error) {
    logger.error("Failed to fetch users by role", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    logger.debug("Searching users", { query });

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { streetAddress: { $regex: query, $options: "i" } },
        { state: { $regex: query, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(20);

    logger.info("Search completed", { query, results: users.length });

    return res.status(200).json({
      success: true,
      data: {
        query,
        count: users.length,
        users,
      },
    });
  } catch (error) {
    logger.error("Search failed", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};

export const getUserStats = async (req, res) => {
  try {
    logger.debug("Fetching user statistics");

    const [total, roleStats, recentUsers] = await Promise.all([
      User.countDocuments(),
      User.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ]),
      User.find().select("-password").sort({ createdAt: -1 }).limit(5),
    ]);

    const stats = {
      total,
      byRole: roleStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentUsers: recentUsers.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
      })),
    };

    logger.info("User statistics fetched successfully");

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error("Failed to fetch user statistics", { error: error.message });
    return res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
};
