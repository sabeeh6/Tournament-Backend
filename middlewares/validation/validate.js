import {z} from "zod";


export const signUpValidationSchema = z.object({
  name: z.string({required_error: "Name is required",})
    .min(1, "Name cannot be empty"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Email is not valid"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "At least 8 characters are required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase, one lowercase, one special character, and one number"
    ),
});

export const signInValidationSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Email is not valid"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "At least 8 characters are required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase, one lowercase, one special character, and one number"
    ),
});
