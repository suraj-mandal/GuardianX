import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {createBrowserRouter} from "react-router-dom";
import './index.css'
import LoginPage from "@/login/LoginPage.tsx"
import RegistrationPage from "./register/RegistrationPage.tsx";
import HomePage from "./home/HomePage.tsx";
import {RouterProvider} from "react-router";
import ErrorPage from "./fallback/ErrorPage.tsx";
import ChatPage from './chat/ChatPage.tsx';


const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: '',
                element: <HomePage/>,
            },
            {
                path: '/login',
                element: <LoginPage/>,
            },
            {
                path: '/register',
                element: <RegistrationPage/>
            },
            {
                path: '/chat',
                element: <ChatPage />
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>
)
