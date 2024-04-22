import {z} from "zod";

const ChatFormSchema = z.object({
    chatMessage: z.string().min(1)
});

export default ChatFormSchema;