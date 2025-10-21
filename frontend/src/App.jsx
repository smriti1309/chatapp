import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import Navbar from "./components/Navbar"
import {Routes,Route, Navigate,Outlet} from "react-router-dom"
import { axiosInstance } from "./lib/axios"
import { useAuthStore } from "./store/useAuthStore.js"
import { useThemeStore } from "./store/useThemeStore.js"
import { Loader } from "lucide-react"
import { useEffect } from "react"
import {Toaster} from "react-hot-toast";


const App=()=>{
const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore();
const {theme}=useThemeStore()
useEffect(()=>{
  checkAuth()
,[]})
if(isCheckingAuth && !authUser) return(
  <div className="flex items-center justify-center h-screen">
    <Loader className="size-10 animate-spin"/>
  </div>
)
const ProtectedRoute = () => {
    // If authUser is null (logged out), redirect to /login
    if (!authUser) {
        return <Navigate to="/login" replace />;
    }
    // If authenticated, render the child route content
    return <Outlet />; 
};
  return (
    
    <div data-theme={theme}>
<Navbar/>
// App.jsx (Corrected Public Routes)

<Routes>
    {/* 1. PUBLIC ROUTES (Redirect AWAY if authenticated) */}
    <Route 
        path="/signup" 
        element={authUser ? <Navigate to="/" replace /> : <SignUpPage />} 
    />
    <Route 
        path="/login" 
        element={authUser ? <Navigate to="/" replace /> : <LoginPage />} 
    />

    {/* 2. PROTECT ALL AUTHENTICATED ROUTES using the wrapper */}
    <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
    </Route>
</Routes>


<Toaster/>
    </div>
  )
}
export default App