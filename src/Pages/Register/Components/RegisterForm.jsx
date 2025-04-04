import React, { useState } from "react";
import { Form, Input, Button, Modal } from "antd";
import "../../../styles/Register/RegisterForm.css"; 
import { registerUser } from "../../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState({ visible: false, message: "", success: false });

  const showModal2 = (message, success) => {
    setModal({ visible: true, message, success });
  };

  const handleRegister = async (values) => {
    try {
      const { fullName, email, address, password } = values;
      const response = await registerUser(fullName, email, address, password);
      console.log("Respuesta del registro:", response);
      showModal2("Registro exitoso", true);
      navigate('/');
    } catch (error) {
      console.error("Error en el registro:", error);
      showModal2("Error al realizar registro", false);
    }
  };

  return (
    <>
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
      <Link to="/">Volver</Link>
    </Form>

    <Modal
    open={modal.visible}
    onCancel={() => setModal({ ...modal, visible: false })}
    footer={[
      <Button
        key="ok"
        type="primary"
        onClick={() => setModal({ ...modal, visible: false })}
      >
        OK
      </Button>,
    ]}
  >
    <div style={{ textAlign: "center", padding: 20 }}>
      {modal.success ? (
        <CheckCircleOutlined style={{ fontSize: 50, color: "blue" }} />
      ) : (
        <CloseCircleOutlined style={{ fontSize: 50, color: "black" }} />
      )}
      <p style={{ fontSize: 18, marginTop: 10 }}>{modal.message}</p>
    </div>
  </Modal>
  </>
  );
};

export default RegisterForm;
