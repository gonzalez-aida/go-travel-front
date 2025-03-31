import React, { useEffect } from "react";
import "../styles/Layouts/Header.css";
import logo from "../assets/logo2.png";
import { FaPlane, FaHotel, FaEnvelope, FaUser, FaSignOutAlt, FaTag } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
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
        <a href="/home">
          <img src={logo} alt="Logo" className="logo-img" />
        </a>
      </div>

      <nav className="nav-links">
        <a href="/flights" className="nav-link">
          <FaPlane className="nav-icon" />
          <span>Vuelos</span>
        </a>
        <a href="/hotels" className="nav-link">
          <FaHotel className="nav-icon" />
          <span>Hoteles</span>
        </a>
        <a href="/offerts" className="nav-link">
          <FaTag className="nav-icon" />
          <span>Ofertas</span>
        </a>
        <a href="/contact" className="nav-link">
          <FaEnvelope className="nav-icon" />
          <span>Contacto</span>
        </a>
        <a href="/profile" className="nav-link">
          <FaUser className="nav-icon" />
          <span>Perfil</span>
        </a>
        <a onClick={handleLogout} className="nav-link" style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <FaSignOutAlt className="nav-icon" />
          <span>Cerrar sesión</span>
        </a>
      </nav>
    </header>
  );
};

export default Header;