import React from "react";
import LoginForm from "./Components/LoginForm";
import logo from "../../assets/logo2.png"; 
import airplaneImage from "../../assets/maleta.jpg"; 
import "../../styles/Login/LoginPage.css"; 

const LoginPage = () => {
  return (
    <div className="login-container">
      
      <div className="login-background">
        <img
          src={airplaneImage}
          alt="Avión viajero"
        />
      </div>

      <div className="login-form-overlay">
        <div className="login-form-container">
          
          <div className="login-logo">
            <img src={logo} alt="Logo" />
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
