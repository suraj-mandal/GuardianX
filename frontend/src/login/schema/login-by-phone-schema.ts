import z from "zod";

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
  );

const schema = z.object({
    phoneNumber: z.string().min(10, "Phone number should be 10 digits")
        .max(10, "Phone number should be 10 digits")
        .regex(phoneRegex, "Phone number should contain digits only"),
    password: z.string().min(4, {message: "Password should be at least 4 characters"})
});

const LoginByPhoneSchema = schema.required();
export default LoginByPhoneSchema;