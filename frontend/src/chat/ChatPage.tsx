import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ChatFormSchema from "./schema/chat-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import useAuthentication from "@/hooks/use-authentication";
import { useNavigate } from "react-router";
import { UserDto } from "@/models/user-dto.ts";
import { Menu, Sidebar } from "lucide-react";
import {BarLoader} from 'react-spinners';
import { Separator } from "@/components/ui/separator";


interface ChatModelInterface {
    body: string;
    sender: string;
    id: string;
}

export default function ChatPage() {

    const { isLoggedIn } = useAuthentication();
    const navigate = useNavigate();

    const userData = useRef<UserDto>();

    const [chats, setChats] = useState<ChatModelInterface[]>([]);

    const [chatLoading, setChatLoading] = useState(false); 

    const [showSideBar, setShowSideBar] = useState(false);

    const [lat, setLat] = useState(22.4955);
    const [lng, setLng] = useState(88.3709);

    const name = useRef<string>();

    const socket = useRef<WebSocket>();

    const form = useForm<z.infer<typeof ChatFormSchema>>({
        resolver: zodResolver(ChatFormSchema),
        defaultValues: {
            chatMessage: ""
        }
    });


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

    useEffect(() => {
        const botWelcomeMessage: ChatModelInterface = {
            body: "Welcome to <b>GuardianX</b>: Your friend indeed for all emergency situations. Please tell me how can I help you out!",
            sender: "Bot",
            id: uuidv4()
        }

        getLocation();

        setChats([botWelcomeMessage]);

    }, []);

    useEffect(() => {
        socket.current = new WebSocket('wss://zivy0ttms5.execute-api.us-east-1.amazonaws.com/production/');

        socket.current.onopen = () => {
            console.log("Opened");
            toast.success("Connection Successful");
        }

        socket.current.onclose = () => {
            console.log("Closed");
            // toast.error("Connection closed");
        }

        socket.current.onmessage = (event) => {
            // console.log(event);
            // const recievedMessage = JSON.parse(event.data);
            const recievedMessage = JSON.parse(event.data);
            const botMessage: ChatModelInterface = {
                body: recievedMessage,
                sender: "Bot",
                id: uuidv4()
            }
            console.log(botMessage);
            setChatLoading(false);
            setChats((chats) => [...chats, botMessage])
        }

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
        const updatedHtml = { __html: chat.body };
        return (
            <div key={chat.id} className={`w-full flex ${chat.sender === "Bot" ? 'justify-start' : 'justify-end'} font-inter`}>
                <div className="flex flex-row gap-x-1">
                    <Avatar className="w-8 h-8">
                        <AvatarImage
                            src={`${chat.sender === "Bot" ? 'https://github.com/shadcn.png' : 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671124.jpg?t=st=1713808692~exp=1713809292~hmac=8b9b96c34cfad1f792b4a0b0d2109a4bfd077a89ec1a0973039fb1883d2cba4d'}`} alt="@guardianX" />
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

    const toggleSideBar = () => {
        console.log("Action bar toggled")
        setShowSideBar((state) => !state)
        // return clearTimeout(action);
    }

    return (
        <div className="h-screen flex flex-row overflow-y-hidden font-inter">
            <div className={`h-screen max-w-[350px] flex ease-in duration-500 transition ${showSideBar ? "opacity-100" : "opacity-0 hidden"} flex-col bg-gray-50 shadow-sm`}>
                <div id="profile_name" className="flex bg-gray-100 items-center gap-x-2 py-[14px] px-8">
                    <Avatar className="bg-gray-600 flex items-center justify-center">
                        <AvatarImage src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671124.jpg?t=st=1713808692~exp=1713809292~hmac=8b9b96c34cfad1f792b4a0b0d2109a4bfd077a89ec1a0973039fb1883d2cba4d" alt="@shadcn" />
                        <AvatarFallback>PP</AvatarFallback>
                    </Avatar>
                    <p className="font-bold text-lg">{name.current}</p>
                </div>
                <div className="flex-1">
                    <div id="profile_name" className="flex items-center gap-x-2 py-[14px] px-8">
                        <Avatar className="flex items-center justify-center">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>PP</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-sm font-bold">Guardian X</h1>
                            <p className="text-[0.75rem]">Online</p>
                        </div>
                    </div>
                    <Separator />
                </div>
                <div>
                    <Button onClick={() => navigate('/')} className="w-full rounded-none">Exit Chat</Button>
                </div>
            </div>
            <div className="h-screen flex flex-1 flex-col overflow-y-hidden">
                <header className="bg-gray-100 py-3 border-b-2 space-x-8 flex items-center border-gray-200 shadow-sm">
                    <Button variant="ghost" className="mx-6" onClick={toggleSideBar}>
                        <Menu />
                    </Button>
                    <div className="flex flex-row w-full gap-x-4">
                        <Avatar className="bg-gray-100 flex items-center justify-center">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>GX</AvatarFallback>
                        </Avatar>
                        <div className="tracking-tight">
                            <h1 className="font-inter font-bold text-xl leading-tight">Guardian X</h1>
                            <p className="font-inter font-medium text-sm leading-tight">Online</p>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto bg-chat-2">
                    <div className=" container my-6 space-y-2">
                        {chatDisplaySection}
                    </div>
                </main>
                <BarLoader width={1700} loading={chatLoading} speedMultiplier={0.4} color="#1d4ed8"/>
                <footer className="w-full overflow-x-hidden">
                    <div className="bg-gray-100 py-3 border-t-2 border-gray-200 shadow-sm">
                        <div className="container">
                            <Form {...form}>
                                <form
                                    className="flex flex-row w-full gap-x-2 items-center"
                                    onSubmit={form.handleSubmit(onSubmit)}>
                                    <FormField
                                        control={form.control}
                                        name="chatMessage"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter your message here" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button variant="outline">Send</Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}