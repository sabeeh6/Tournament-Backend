import { signUpValidationSchema , signInValidationSchema } from "./validate.js";

export const signUpValidationRequest = (req, res, next) => {
  try {
    const result = signUpValidationSchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((err) => {
        const field = err.path.join(".");

        // Friendly message system
        let friendlyMessage = "";

        if (err.code === "invalid_type") {
          friendlyMessage = `${field} is required`;
        } else if (err.code === "too_small") {
          friendlyMessage = `${field} must be at least ${err.minimum} characters`;
        } else if (err.code === "too_big") {
          friendlyMessage = `${field} cannot be more than ${err.maximum} characters`;
        } else {
          friendlyMessage = err.message; // fallback
        }

        return {
          field,
          message: friendlyMessage,
        };
      });

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    next();
  } catch (error) {
    console.error("Error", error.message);
  }
};

export const signInValidationRequest = (req, res, next) => {
  try {
    const result = signInValidationSchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((err) => {
        const field = err.path.join(".");

        // Friendly message system
        let friendlyMessage = "";

        if (err.code === "invalid_type") {
          friendlyMessage = `${field} is required`;
        } else if (err.code === "too_small") {
          friendlyMessage = `${field} must be at least ${err.minimum} characters`;
        } else if (err.code === "too_big") {
          friendlyMessage = `${field} cannot be more than ${err.maximum} characters`;
        } else {
          friendlyMessage = err.message; // fallback
        }

        return {
          field,
          message: friendlyMessage,
        };
      });

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    next();
  } catch (error) {
    console.error("Error", error.message);
  }
};
