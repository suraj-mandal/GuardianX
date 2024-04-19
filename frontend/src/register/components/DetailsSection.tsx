import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {MoveRight} from "lucide-react";

interface DetailsSectionProps {
    moveToNext: () => void;
}

export default function DetailsSection({moveToNext}: DetailsSectionProps) {

    const [showHi, setShowHi] = useState(false);
    const [showHeading, setShowHeading] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [showOnBoarding, setShowOnBoarding] = useState(false);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const hiTimeout = setTimeout(() => setShowHi(true), 500);
        return () => clearTimeout(hiTimeout);
    }, []);

    useEffect(() => {
        const headingTimeout = setTimeout(() => setShowHeading(true), 900);
        return () => clearTimeout(headingTimeout);
    }, []);

    useEffect(() => {
        const descriptionTimeout = setTimeout(() => setShowDescription(true), 1500);
        return () => clearTimeout(descriptionTimeout);
    }, []);

    useEffect(() => {
        const onBoardingTimeOut = setTimeout(() => setShowOnBoarding(true), 2400);
        return () => clearTimeout(onBoardingTimeOut);
    }, []);

    useEffect(() => {
        const buttonTimeout = setTimeout(() => setShowButton(true), 3000);
        return () => clearTimeout(buttonTimeout);
    }, []);


    return (
        <div className="overflow-hidden relative mt-8 font-inter bg-slate-50 container">
            <div className="space-y-6 z-4">
                <h1
                    className={`text-8xl font-black tracking-tighter text-gray-900 transition ease-in duration-300 ${!showHi ? "opacity-0" : "opacity-100"}`}>
                    Hi!
                </h1>
                <h1 className={`text-6xl font-bold tracking-tighter text-gray-700 transition ease-in duration-500 ${!showHeading ? "opacity-0" : "opacity-100"}`}>Welcome
                    to GuardianX: Rescue AI</h1>
                <h2 className={`text-4xl font-semibold tracking-tighter text-gray-500 transition ease-in duration-500 ${!showDescription ? "opacity-0" : "opacity-100"}`}>
                    Our AI will help you out in every critical situation that you can think of.
                </h2>
                <h2 className={`text-3xl font-bold tracking-tighter text-gray-900 transition ease-in duration-500 ${!showOnBoarding ? "opacity-0" : "opacity-100"}`}>Let's
                    get onboarded!</h2>
            </div>
            <div className="mt-12 z-4">
                <Button
                    className={`text-white relative inline-flex font-bold tracking-tighter transition ease-out duration-500 z-4 ${!showButton ? "opacity-0" : "opacity-100"} animate-bounce`}
                    onClick={moveToNext}
                >
                    <MoveRight/>
                </Button>
            </div>
        </div>
    )
}