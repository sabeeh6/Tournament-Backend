import express from "express";
import {  getAllUsers,  getUserById,  createUser,  updateUser,  deleteUser,  bulkDeleteUsers,  getUsersByRole,  searchUsers,  getUserStats } from "../controllers/userController.js";
import { authenticateUser, authorizeRoles } from "../middlewares/authMiddleware.js";
import { signUpValidationRequest } from "../middlewares/validation/index.js";
import { createOrganizor, getOrganizor, updateOrganizor } from "../controllers/adminController.js";

const adminRouter = express.Router();


// Get all users (with pagination, filtering, sorting)
// Query params: ?page=1&limit=10&role=user&search=john&sortBy=createdAt&order=desc
// adminRouter.get("/", authenticateUser, authorizeRoles("admin"), getAllUsers);
// adminRouter.get("/:id", authenticateUser, getUserById);

// Search users
// Query params: ?query=john
// adminRouter.get("/search/query", authenticateUser, searchUsers);
// adminRouter.get("/role/:role", authenticateUser, authorizeRoles("admin"), getUsersByRole);

// Get user statistics (admin only)
// adminRouter.get("/stats/overview", authenticateUser, authorizeRoles("admin"), getUserStats);

// Create new user
adminRouter.post("/create-user", authenticateUser, authorizeRoles("admin"), signUpValidationRequest, createUser);
adminRouter.post("/add-organizor", authenticateUser, authorizeRoles("admin"), createOrganizor);
adminRouter.post("/update-organizor/:id",authenticateUser , authorizeRoles("admin") , updateOrganizor);
adminRouter.get("/get-all-organizor", authenticateUser , authorizeRoles("admin"), getOrganizor);

// Update user
adminRouter.patch("/:id", authenticateUser,
//   validate(updateUserSchema),
  updateUser
);

// Delete single user
adminRouter.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteUser);
adminRouter.post( "/bulk/delete",  authenticateUser,  authorizeRoles("admin"),  bulkDeleteUsers);

export default adminRouter;
