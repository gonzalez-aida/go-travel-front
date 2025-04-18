import { Routes, Route } from "react-router-dom";
import LoginPage from "../Pages/Login/LoginPage";
import HomePage from "../Pages/Home/HomePage";
import RegisterPage from "../Pages/Register/RegisterPage";
import ProfilePage from "../Pages/Profile/ProfilePage";
import FlightPage from "../Pages/Flights/Flights";
import HotelPage from "../Pages/Hotels/HotelPage";
import ContactPage from "../Pages/Contact/ContactPage";
import OffersPage from "../Pages/Offers/OffersPage";
import ProtectedRoute from "./ProtectedRoute"; 

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />

            <Route path="/profile" element={
                <ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>
            } />
            <Route path="/flights" element={
                <ProtectedRoute>
                    <FlightPage />
                </ProtectedRoute>
            } />
            <Route path="/hotels" element={
                <ProtectedRoute>
                    <HotelPage />
                </ProtectedRoute>
            } />
            <Route path="/contact" element={
                <ProtectedRoute>
                    <ContactPage />
                </ProtectedRoute>
            } />
            <Route path="/offerts" element={
                <ProtectedRoute>
                    <OffersPage />
                </ProtectedRoute>
            } />
        </Routes>
    );
};

export default AppRoutes;