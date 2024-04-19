import {create} from "zustand";
import {UserDto} from "@/models/user-dto.ts";

interface LoginStore {
    isLoggedIn: boolean;
    login: (username: UserDto) => void;
    logout: () => void
}

const useAuthentication = create<LoginStore>((set) => ({
    isLoggedIn: localStorage.getItem("currentUser") !== null,
    login: (userDetails: UserDto) => {
        localStorage.setItem("currentUser", JSON.stringify(userDetails));
        set({isLoggedIn: true});
    },
    logout: () => {
        localStorage.removeItem("currentUser");
        set({isLoggedIn: false});
    },
}));

export default useAuthentication;