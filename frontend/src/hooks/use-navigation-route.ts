import {create} from "zustand";

interface NavigationRouteStore {
    currentRoute: string,
    setCurrentRoute: (route: string) => void;
}

const useNavigationRoute = create<NavigationRouteStore>((set) => ({
    currentRoute: "/",
    setCurrentRoute: (route: string) => set({currentRoute: route}),
}));

export default useNavigationRoute;