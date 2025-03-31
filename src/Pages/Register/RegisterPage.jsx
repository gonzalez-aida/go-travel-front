import React from "react";
import RegisterForm from "./Components/RegisterForm";
import airplaneImage from "../../assets/chalupa.jpg"; 
import "../../styles/Register/RegisterPage.css"; 

const RegisterPage = () => {
  return (
    <div className="register-container">
      <div className="register-background">
        <img src={airplaneImage} alt="Avión viajero" />
      </div>

      <div className="register-form-overlay">
        <div className="register-form-container">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
