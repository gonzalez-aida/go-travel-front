import React, { useEffect } from "react";
import "../styles/Layouts/Header.css";
import logo from "../assets/logo2.png";
import { FaPlane, FaHotel, FaEnvelope, FaUser, FaSignOutAlt, FaTag } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useNavigate, Link } from "react-router-dom";
import { logoutUser } from '../services/authService';

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para acceder a esta página");
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logoutUser();
    toast.success('Sesión cerrada correctamente');
    navigate('/'); 
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/home"> 
          <img src={logo} alt="Logo" className="logo-img" />
        </Link>
      </div>

      <nav className="nav-links">
        <Link to="/flights" className="nav-link"> 
          <FaPlane className="nav-icon" />
          <span>Vuelos</span>
        </Link>
        <Link to="/hotels" className="nav-link"> 
          <FaHotel className="nav-icon" />
          <span>Hoteles</span>
        </Link>
        <Link to="/offerts" className="nav-link"> 
          <FaTag className="nav-icon" />
          <span>Ofertas</span>
        </Link>
        <Link to="/contact" className="nav-link"> 
          <FaEnvelope className="nav-icon" />
          <span>Contacto</span>
        </Link>
        <Link to="/profile" className="nav-link"> 
          <FaUser className="nav-icon" />
          <span>Perfil</span>
        </Link>
        <div onClick={handleLogout} className="nav-link" style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <FaSignOutAlt className="nav-icon" />
        </div>
      </nav>
    </header>
  );
};

export default Header;
