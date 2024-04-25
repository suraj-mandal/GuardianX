import {create} from "zustand";
import {UserDto} from "@/models/user-dto.ts";

interface LoginStore {
    isSubscribed: boolean;
    subscribe: () => void;
    unsubscribe: () => void
}

const useSubscription = create<LoginStore>((set) => ({
    isSubscribed: localStorage.getItem("isSubscribed") !== null,
    subscribe: () => {
        localStorage.setItem("isSubscribed", JSON.stringify(true));
        set({isSubscribed: true});
    },
    unsubscribe: () => {
        localStorage.removeItem("isSubscribed");
        set({isSubscribed: false});
    }
}));

export default useSubscription;