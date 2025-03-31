import React from "react";
import { Form, Input, Button } from "antd";
import "../../../styles/Register/RegisterForm.css"; 
import { registerUser } from "../../../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    try {
      const { fullName, email, address, password } = values;
      const response = await registerUser(fullName, email, address, password);
      console.log("Respuesta del registro:", response);
      toast.success("Registro exitoso");
      navigate('/');
    } catch (error) {
      console.error("Error en el registro:", error);
      toast.error("Error en el registro");
    }
  };

  return (
    <Form onFinish={handleRegister} layout="vertical" className="register-form">
      <Form.Item
        label="Nombre completo"
        name="fullName"
        rules={[{ required: true, message: "Por favor ingresa tu nombre completo" }]}
      >
        <Input placeholder="Ingresa tu nombre completo" />
      </Form.Item>

      <Form.Item
        label="Correo electrónico"
        name="email"
        rules={[
          { required: true, message: "Por favor ingresa tu correo electrónico" },
          { type: "email", message: "Ingresa un correo electrónico válido" }
        ]}
      >
        <Input placeholder="Ingresa tu correo" />
      </Form.Item>

      <Form.Item
        label="Dirección"
        name="address"
        rules={[{ required: true, message: "Por favor ingresa tu dirección" }]}
      >
        <Input placeholder="Ingresa tu dirección" />
      </Form.Item>
      <Form.Item
        label="Contraseña"
        name="password"
        rules={[{ required: true, message: "Por favor ingresa tu contraseña" }]}
      >
        <Input.Password placeholder="********" />
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Registrar
        </Button>
      </Form.Item>
      <a href="/"type="primary" block>
          Volver
      </a>
    </Form>
  );
};

export default RegisterForm;
