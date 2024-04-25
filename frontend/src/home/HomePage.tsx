import useAuthentication from "@/hooks/use-authentication.ts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UserDto } from "@/models/user-dto.ts";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useSubscription from "@/hooks/use-subscription";
import { toast } from "sonner";

export default function HomePage() {

    const { isLoggedIn, logout } = useAuthentication();
    const {isSubscribed, subscribe, unsubscribe} = useSubscription();
    const navigate = useNavigate();

    const [name, setName] = useState("");

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        const userDataString = localStorage.getItem("currentUser")!;
        const userData: UserDto = JSON.parse(userDataString);
        setName(userData.fullName);
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        let timeout = null;
        if (!isSubscribed) {
            // show toast here
            toast("Please check your mail",  {
                description: "Please subscribe to our topics so that we can send you notifications",
                action: {
                    label: "Close",
                    onClick: () => {
                        console.log("Thanks for subscribing!");
                    }
                }
            });
            timeout = setTimeout(() => {
                subscribe();
            }, 1000);
        }
        return () => {
            if (timeout != null) {
                clearTimeout(timeout);
            }
        }
    }, []);

    const performLogout = () => {
        logout();
        unsubscribe();
        navigate("/login");
    }

    const enterChatPage = () => {
        navigate("/chat");
    }

    return (
        <div className="container mt-24 font-inter">
            <nav className="flex flex-row items-center justify-between">
                <div>
                    <h1 className="text-5xl font-bold ">Welcome {name}!</h1>
                </div>
                <Button variant="outline" size="sm" onClick={performLogout}>Logout</Button>
            </nav>
            <div className="mt-12">
                <Card>
                    <CardHeader>
                        <div className="flex flex-row gap-x-4 items-center ">
                            <div>
                                {/* will display avatar here */}
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>GX</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="space-y-2">
                                <CardTitle>GuardianX: Bot</CardTitle>
                                <CardDescription>Your all weather friend for emergency needs.</CardDescription>
                            </div>
                        </div>

                    </CardHeader>
                    <CardContent>
                        <p>Please inform me whenever you are facing any kind of emergencies, be it medical, or
                            involving traffic or any disaster. I will be doing my best to help you out. Thanks
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={enterChatPage}>Enter Chat</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}