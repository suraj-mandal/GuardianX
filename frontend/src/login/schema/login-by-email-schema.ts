import z from "zod";

const schema = z.object({
    email: z.string()
        .min(1, {message: "Email cannot be empty"})
        .email("Should be a valid email"),
    password: z.string().min(4, {message: "Password should be at least 4 characters"})
});

const LoginByEmailSchema = schema.required();
export default LoginByEmailSchema;