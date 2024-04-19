import {useEffect, useState} from "react";
import useAuthentication from "@/hooks/use-authentication.ts";
import {useNavigate} from "react-router";
import DetailsSection from "@/register/components/DetailsSection.tsx";
import RegistrationForm from "@/register/components/RegistrationForm.tsx";
import Logo from "@/assets/logo.png";
import OnboardingBackground from "@/register/components/OnBoardingBackground";


export default function RegistrationPage() {

    // const {isLoggedIn} = useAuthentication();
    const navigate = useNavigate();
    const {isLoggedIn} = useAuthentication();
    const [showOnBoarding, setShowOnBoarding] = useState(false);

    useEffect(() => {
        const shouldOnBoardingBeRequired = localStorage.getItem("onBoardingDone");
        if (shouldOnBoardingBeRequired === null) {
            setShowOnBoarding(true);
        }
    }, [setShowOnBoarding]);

    // useEffect for navigating
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    const moveToRegistrationSection = () => {
        setShowOnBoarding(false);
        localStorage.setItem("onBoardingDone", JSON.stringify(true));
    }

    return (
        <div className="h-screen overflow-x-hidden relative">
            <nav className="flex items-center justify-center py-6">
                <img src={Logo} className="w-48"/>
            </nav>
            {showOnBoarding ?
                <DetailsSection moveToNext={moveToRegistrationSection}/> :
                <RegistrationForm/>
            }
            {showOnBoarding && <OnboardingBackground />}
        </div>
    )
}