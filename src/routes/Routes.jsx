import { Routes, Route } from "react-router-dom";
import LoginPage from "../Pages/Login/LoginPage";
import HomePage from "../Pages/Home/HomePage";
import RegisterPage from "../Pages/Register/RegisterPage";
import ProfilePage from "../Pages/Profile/ProfilePage";
import FlightPage from "../Pages/Flights/Flights";
import HotelPage from "../Pages/Hotels/HotelPage";
import ContactPage from "../Pages/Contact/ContactPage";
import OffersPage from "../Pages/Offers/OffersPage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/flights" element={<FlightPage />} />
            <Route path="/hotels" element={<HotelPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/offerts" element={<OffersPage />} />
        </Routes>
    );
};

export default AppRoutes;
