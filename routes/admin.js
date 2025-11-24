import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  bulkDeleteUsers,
  getUsersByRole,
  searchUsers,
  getUserStats,
} from "../controllers/userController.js";
import { authenticateUser, authorizeRoles } from "../middlewares/authMiddleware.js";
import { signUpValidationRequest } from "../middlewares/validation/index.js";

const adminRouter = express.Router();


// Get all users (with pagination, filtering, sorting)
// Query params: ?page=1&limit=10&role=user&search=john&sortBy=createdAt&order=desc
adminRouter.get("/", authenticateUser, authorizeRoles("admin"), getAllUsers);
adminRouter.get("/:id", authenticateUser, getUserById);

// Search users
// Query params: ?query=john
adminRouter.get("/search/query", authenticateUser, searchUsers);
adminRouter.get("/role/:role", authenticateUser, authorizeRoles("admin"), getUsersByRole);

// Get user statistics (admin only)
adminRouter.get("/stats/overview", authenticateUser, authorizeRoles("admin"), getUserStats);

// Create new user
adminRouter.post(
  "/create-user",
  authenticateUser,
  authorizeRoles("admin"),
  signUpValidationRequest,
  createUser
);

// Update user
adminRouter.patch(
  "/:id",
  authenticateUser,
//   validate(updateUserSchema),
  updateUser
);

// Delete single user
adminRouter.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteUser);

// Bulk delete users
// Body: { "userIds": ["id1", "id2", "id3"] }
adminRouter.post(
  "/bulk/delete",
  authenticateUser,
  authorizeRoles("admin"),
  bulkDeleteUsers
);

export default adminRouter;
