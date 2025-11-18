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
// import { validate } from "../middleware/validationMiddleware.js";
import { signUpValidationRequest } from "../middlewares/validation/index.js";
// import {
//   createUserSchema,
//   updateUserSchema,
// } from "../validation/userValidation.js";

const authRouter = express.Router();


// Get all users (with pagination, filtering, sorting)
// Query params: ?page=1&limit=10&role=user&search=john&sortBy=createdAt&order=desc
authRouter.get("/", authenticateUser, authorizeRoles("admin"), getAllUsers);

// Get single user by ID
authRouter.get("/:id", authenticateUser, getUserById);

// Search users
// Query params: ?query=john
authRouter.get("/search/query", authenticateUser, searchUsers);

// Get users by role
authRouter.get("/role/:role", authenticateUser, authorizeRoles("admin"), getUsersByRole);

// Get user statistics (admin only)
authRouter.get("/stats/overview", authenticateUser, authorizeRoles("admin"), getUserStats);

// Create new user
authRouter.post(
  "/create-user",
//   authenticateUser,
//   authorizeRoles("admin"),
  signUpValidationRequest,
  createUser
);

// Update user
authRouter.patch(
  "/:id",
  authenticateUser,
//   validate(updateUserSchema),
  updateUser
);

// Delete single user
authRouter.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteUser);

// Bulk delete users
// Body: { "userIds": ["id1", "id2", "id3"] }
authRouter.post(
  "/bulk/delete",
  authenticateUser,
  authorizeRoles("admin"),
  bulkDeleteUsers
);

export default authRouter;
