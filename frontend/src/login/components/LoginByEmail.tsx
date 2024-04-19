import {useState} from "react";
import {useNavigate} from "react-router";
import useAuthentication from "@/hooks/use-authentication.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {performLoginByEmail} from "@/lib/api.ts";
import {UserDto} from "@/models/user-dto.ts";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Eye, EyeOff, LogIn} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import LoginByEmailSchema from "@/login/schema/login-by-email-schema.ts";


interface IUserLoginInputs {
    email: string;
    password: string;
}


export default function LoginByEmail() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(true);

    const navigate = useNavigate();

    const {login} = useAuthentication();

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset
    } = useForm<IUserLoginInputs>({
        resolver: zodResolver(LoginByEmailSchema)
    });

    const handleFormSubmit = (data: IUserLoginInputs) => {
        setLoading(true);
        toast.promise(performLoginByEmail(data.email, data.password), {
            loading: "Logging in",
            success: "Login successful",
            error: "Please check your credentials and try again"
        }).then((response) => {
            console.log(response);
            reset();
            const userData: UserDto = response.data;
            login(userData);
            navigate("/");
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            setLoading(false);
        });
    }


    return (
        <div className="flex justify-center font-inter mt-8">
            <div className="w-full flex flex-col items-center">
                <div className="lg:w-5/6 xl:w-1/2">
                    <form autoComplete="off" onSubmit={handleSubmit(handleFormSubmit)}>
                        <Card>
                            <CardHeader>
                            </CardHeader>
                            <CardContent>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-3">
                                        <Label htmlFor="email">Email</Label>
                                        <input id="email" type="text"
                                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                               placeholder="Enter your email"
                                               {...register('email')}
                                        />
                                        {errors.email?.message &&
                                            <p className="text-sm font-medium font-inter text-red-900">{errors.email?.message}</p>}

                                    </div>
                                    <div className="flex flex-col space-y-3">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <input id="password"
                                                   type={showPassword ? "password" : "text"}
                                                   className="bg-gray-50
                                                        border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                   placeholder="Enter your password"
                                                   {...register('password')}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 z-50">
                                                {showPassword ? <Eye/> : <EyeOff/>}
                                            </button>
                                        </div>


                                        {errors.password?.message &&
                                            <p className="text-sm font-medium font-inter text-red-900">{errors.password?.message}</p>}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex items-center flex-col">
                                <Button type="submit" disabled={loading} className="font-bold text-sm tracking-wide space-x-2">
                                    <LogIn className="h-4 w-5 font-bold" />
                                    <span>Login</span>
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                    <div className="text-center mt-8">
                        Don't have account? <Link to="/register" className="font-bold">Register here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}