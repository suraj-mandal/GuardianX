import z from "zod";

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
  );

const schema = z.object({
    fullName: z.string()
        .min(1, {message: "User name cannot be empty"}),
    email: z.string()
        .min(1, {message: "Email cannot be empty"})
        .email("Should be a valid email"),
    phoneNumber: z.string().min(10, "Phone number should be 10 digits")
        .max(10, "Phone number should be 10 digits")
        .regex(phoneRegex, "Phone number should contain digits only"),
    password: z.string().min(4, {message: "Password should be at least 4 characters"})
});

const UserRegistrationSchema = schema.required();
export default UserRegistrationSchema;