import Colors from "./constants/color-constants.ts";
import {Toaster as ReactHotToastToaster} from "react-hot-toast";
import {Outlet} from "react-router";
import { Toaster } from "@/components/ui/sonner";

export default function App() {

    return (
        <div className="bg-gray-50">
            <main>
                <Toaster />
                <ReactHotToastToaster
                    position="top-center"
                    reverseOrder={false}
                    toastOptions={{
                        className: 'font-inter text-sm font-medium',
                        success: {
                            iconTheme: {
                                primary: Colors.PRIMARY,
                                secondary: Colors.WHITE
                            }
                        },
                        error: {
                            iconTheme: {
                                primary: Colors.DANGER,
                                secondary: Colors.WHITE
                            }
                        }
                    }}

                />
                <Outlet/>
            </main>
        </div>
    )
}