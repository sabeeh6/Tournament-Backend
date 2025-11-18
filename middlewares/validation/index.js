import { signUpValidationSchema } from "./validate.js";

export const signUpValidationRequest = (req, res, next) => {
    try {        
        const result = signUpValidationSchema.safeParse(req.body);
      
        if (!result.success) {
          console.log("❌ Validation failed:", result.error.issues);
      
          const errors = result.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code
          }));
      
          return res.status(400).json({
            success: false,
            message: "Validation error",
            errors
          });
        }
        next();
    } catch (error) {
        console.error("Error" , error.message);
        
    }
};
