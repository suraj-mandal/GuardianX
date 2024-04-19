import useAuthentication from "@/hooks/use-authentication.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {UserDto} from "@/models/user-dto.ts";
import {Button} from "@/components/ui/button.tsx";

export default function HomePage() {

    const {isLoggedIn, logout} = useAuthentication();
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
        localStorage.getItem("")
    }, []);

    const performLogout = () => {
        logout();
        navigate("/login");
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
                This will be chatbot section
            </div>
        </div>
    );
}