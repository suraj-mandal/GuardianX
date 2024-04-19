import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import LoginByPhone from "@/login/components/LoginByPhone.tsx";
import LoginByEmail from "@/login/components/LoginByEmail.tsx";
import {useEffect, useState} from "react";
import useAuthentication from "@/hooks/use-authentication.ts";
import {useNavigate} from "react-router";
import Logo from "@/assets/logo.png";

export default function LoginPage() {

    const {isLoggedIn} = useAuthentication();
    const navigate = useNavigate();
    const [animate, setAnimate] = useState(true);

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimate(false);
        }, 500);

        return () => clearTimeout(timeout);
    })


    return (
        <div className="h-screen w-full lg:flex lg:flex-row bg-slate-50 font-inter">
            {/* will hold the images carousel */}
            <div className="basis-5/12 hidden lg:flex lg:flex-col justify-end bg-hero-image-1 bg-cover">
                <div className="text-white my-24 mx-12 space-y-2">
                    <div
                        className={`text-7xl leading-tight tracking-[-0.4rem] font-bold ease-in duration-500 transition ${animate ? 'opacity-0' : 'opacity-100'}`}>
                        Guardian X:
                    </div>
                    <div className={`text-2xl tracking-tight font-medium ease-in duration-500 transition ${animate ? 'opacity-0' : 'opacity-100'}`}>
                        Your digital lifeline in times of crisis.
                    </div>
                </div>
            </div>
            <div className={`basis-6/12 flex-col items-center justify-center ease-in duration-300 flex ${animate ? 'opacity-0' : 'opacity-100'}`}>
                <div>
                    <img src={Logo} className="mb-8 w-[250px]" alt="Logo of guardian X"/>
                </div>
                <Tabs defaultValue="phone" className="w-full">
                    <div className="flex items-center w-full justify-center">
                        <TabsList className="">
                            <TabsTrigger value="phone">
                                Login By Phone
                            </TabsTrigger>
                            <TabsTrigger value="email">
                                Login By Email
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="phone">
                        <LoginByPhone/>
                    </TabsContent>
                    <TabsContent value="email">
                        <LoginByEmail/>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}