import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useForm} from "react-hook-form";
import {z} from "zod";
import ChatFormSchema from "./schema/chat-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {useEffect, useState, useRef} from "react";
import {v4 as uuidv4} from 'uuid';
import {Textarea} from "@/components/ui/textarea";
import toast from "react-hot-toast";
import useAuthentication from "@/hooks/use-authentication";
import {useNavigate} from "react-router";
import {UserDto} from "@/models/user-dto.ts";
import {SendHorizontal, X} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import ChatLoader from "@/chat/components/ChatLoader.tsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";


interface ChatModelInterface {
    body: string;
    sender: string;
    id: string;
}

export default function ChatPage() {

    const {isLoggedIn} = useAuthentication();
    const navigate = useNavigate();

    const userData = useRef<UserDto>();

    const [chats, setChats] = useState<ChatModelInterface[]>([]);

    const [chatLoading, setChatLoading] = useState(false);

    const [lat, setLat] = useState(22.4955);
    const [lng, setLng] = useState(88.3709);

    const name = useRef<string>();

    const socket = useRef<WebSocket>();

    const userQueryForm = useRef<HTMLFormElement>(null);

    const form = useForm<z.infer<typeof ChatFormSchema>>({
        resolver: zodResolver(ChatFormSchema),
        defaultValues: {
            chatMessage: ""
        }
    });

    const chatSection = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatSection) {
            chatSection.current?.scrollIntoView({behavior: 'smooth'});
        }
    }, [chats])


    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        const userDataString = localStorage.getItem("currentUser")!;
        userData.current = JSON.parse(userDataString);
        name.current = userData.current?.fullName;
    }, [isLoggedIn, navigate]);


    const getLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geo Location not supported!")
        } else {
            navigator.geolocation.getCurrentPosition((position) => {
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
            });
        }
    }

    function createWebSocket(init = false) {
        const newSocket = new WebSocket('wss://zivy0ttms5.execute-api.us-east-1.amazonaws.com/production/');

        newSocket.onopen = () => {
            console.log("Opened");
            toast.success("Connection Successful");

            if (init) {
                const botWelcomeMessage: ChatModelInterface = {
                    body: "Welcome to <b>GuardianX</b>: Your friend indeed for all emergency situations. Please tell me how can I help you out!",
                    sender: "Bot",
                    id: uuidv4()
                }

                setChats([botWelcomeMessage]);
            }

            setChatLoading(false);
        }

        newSocket.onclose = () => {
            console.log("Closed");
            // toast.error("Connection closed");
        }

        newSocket.onmessage = (event) => {
            const receivedMessage = JSON.parse(event.data);

            if (socket.current?.readyState === WebSocket.CLOSED) {
                socket.current = createWebSocket();
            }

            const botMessage: ChatModelInterface = {
                body: receivedMessage,
                sender: "Bot",
                id: uuidv4()
            }
            console.log(botMessage);
            setChatLoading(false);
            setChats((chats) => [...chats, botMessage])
        }

        return newSocket;
    }

    useEffect(() => {
        getLocation();
        setChatLoading(true);
        socket.current = createWebSocket(true);
        const currentSocket = socket.current;
        return () => {
            currentSocket.close();
        }
    }, []);

    function sendMessage(message: string) {
        const messageBody = {
            "action": "sendChatResponse",
            "query": message,
            "lat": lat,
            "lng": lng,
            "user": JSON.stringify(userData.current)
        };
        console.log(messageBody);
        if (socket.current !== undefined) {
            socket.current.send(JSON.stringify(messageBody));
            setChatLoading(true);
        } else {
            console.log("Socket is undefined!");
        }

    }


    function onSubmit(values: z.infer<typeof ChatFormSchema>) {
        console.log(values);
        const newChat: ChatModelInterface = {
            body: values.chatMessage,
            sender: "User",
            id: uuidv4()
        };
        sendMessage(values.chatMessage);
        setChats((chats) => [...chats, newChat]);
        form.reset();
    }

    const chatDisplaySection = chats.map((chat) => {
        const updatedHtml = {__html: chat.body};
        return (
            <div key={chat.id}
                 className={`w-full flex ${chat.sender === "Bot" ? 'justify-start' : 'justify-end'} font-inter`}>
                <div className="flex flex-row gap-x-1">
                    <Avatar className="w-8 h-8">
                        <AvatarImage
                            src={`${chat.sender === "Bot" ? 'https://github.com/shadcn.png' : 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671124.jpg?t=st=1713808692~exp=1713809292~hmac=8b9b96c34cfad1f792b4a0b0d2109a4bfd077a89ec1a0973039fb1883d2cba4d'}`}
                            alt="@guardianX"/>
                        <AvatarFallback>GX</AvatarFallback>
                    </Avatar>
                    <div className={`max-w-[450px] rounded ${chat.sender === "Bot" ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <p dangerouslySetInnerHTML={updatedHtml} className="mx-4 my-2">
                        </p>
                    </div>
                </div>

            </div>
        );
    });

    const submitOnPressingEnter = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'enter' && !e.shiftKey) {
            console.log('Enter key pressed!');
            if (userQueryForm) {
                e.preventDefault();
                userQueryForm.current?.requestSubmit();
            }
            // form.handleSubmit(onSubmit);
        }
    }

    return (
        <div className="h-screen flex flex-row overflow-y-hidden font-inter">
            <div className="h-screen flex flex-1 flex-col overflow-y-hidden">
                <header className="bg-gray-100 py-3 border-b-2 space-x-8 flex items-center border-gray-200 shadow-sm">
                    <div className="flex flex-row w-full gap-x-4 container">
                        <Avatar className="bg-gray-100 flex items-center justify-center">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
                            <AvatarFallback>GX</AvatarFallback>
                        </Avatar>
                        <div className="tracking-tight">
                            <h1 className="font-inter font-bold text-xl leading-tight">Guardian X</h1>
                            <p className="font-inter font-medium text-sm leading-tight">Online</p>
                        </div>
                    </div>

                    <div className="px-12">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="link" onClick={() => navigate('/')}><X/></Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Exit Chat</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                </header>
                <ScrollArea className="flex-1 overflow-y-auto bg-chat-2">
                    <div className=" container my-6 space-y-2">
                        {chatDisplaySection}
                        {chatLoading && <ChatLoader/>}
                        <div ref={chatSection}/>
                    </div>
                </ScrollArea>
                <footer className="w-full overflow-x-hidden">
                    <div className="bg-gray-100 py-3 border-t-2 border-gray-200 shadow-sm">
                        <div className="container">
                            <Form {...form}>
                                <form
                                    ref={userQueryForm}
                                    className="flex flex-row w-full gap-x-2 items-center"
                                    onSubmit={form.handleSubmit(onSubmit)}>
                                    <FormField
                                        control={form.control}
                                        name="chatMessage"
                                        render={({field}) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Textarea
                                                        onKeyDown={submitOnPressingEnter}
                                                        rows={1}
                                                        placeholder="Enter your message here" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button variant="outline">
                                        <SendHorizontal/>
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}