import {useState} from "react";
import {useNavigate} from "react-router";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {performRegistration} from "@/lib/api.ts";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {CircleArrowRight, Eye, EyeOff} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import UserRegistrationSchema from "@/register/schema/user-registration-schema.ts";

interface IUserRegistrationInputs {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export default function RegistrationForm() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(true);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset
    } = useForm<IUserRegistrationInputs>({
        resolver: zodResolver(UserRegistrationSchema)
    });

    const handleFormSubmit = (data: IUserRegistrationInputs) => {
        setLoading(true);
        toast.promise(performRegistration(data.fullName, data.email, data.phoneNumber, data.password), {
            loading: "Onboarding in progress",
            success: "Registration successful. Please log in",
            error: "Could not register. Please try again"
        }).then((response) => {
            reset();
            const successMessage: string = response.data;
            console.log(successMessage);
            navigate("/login");
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            setLoading(false);
        });
    }


    return (
        <div className="flex justify-center font-inter mt-8 container">
            <div className="w-full flex flex-col items-center">
                <div className="lg:w-5/6 xl:w-1/2">
                    <form autoComplete="off" onSubmit={handleSubmit(handleFormSubmit)}>
                        <Card>
                            <CardHeader className="space-y-3">
                                <CardTitle className="font-bold">Sign Up</CardTitle>
                                <CardDescription>Let's add your details, so we can onboard you.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-3">
                                        <Label htmlFor="name">Full Name</Label>
                                        <input id="name" type="text"
                                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                               placeholder="Enter your full name"
                                               {...register('fullName')}
                                        />
                                        {errors.fullName?.message &&
                                            <p className="text-sm font-medium font-inter text-red-900">{errors.fullName?.message}</p>}

                                    </div>
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
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <input id="phone" type="text"
                                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                               placeholder="Enter your phone number"
                                               {...register('phoneNumber')}
                                        />
                                        {errors.phoneNumber?.message &&
                                            <p className="text-sm font-medium font-inter text-red-900">{errors.phoneNumber?.message}</p>}

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
                                <Button type="submit" disabled={loading}
                                        className="font-bold text-sm tracking-wide space-x-2">
                                    <CircleArrowRight className="h-5 w-5"/>
                                    <span>Register</span>
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                    <div className="text-center my-4">
                        Already our member? <Link to="/login" className="font-bold">Login here!</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}