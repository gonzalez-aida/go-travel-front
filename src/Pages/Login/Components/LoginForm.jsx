import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Typography, Modal } from "antd";
import "../../../styles/Login/LoginForm.css";
import { loginUser, verifyMFA } from "../../../services/authService";
import ResetPass from "./Modals/ResetPass";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const LoginForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [mfaForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [mfaModalVisible, setMfaModalVisible] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [otpAuthUrl, setOtpAuthUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(false);
  const [modal, setModal] = useState({ visible: false, message: "", success: false });

  const showModal2 = (message, success) => {
    setModal({ visible: true, message, success });
  };

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const { email, password } = values;
      
      const response = await loginUser(email, password);
      
      if (response.requiresMFA) {
        setUserEmail(email);
        setOtpAuthUrl(response.otpAuthUrl);
        setMfaModalVisible(true);
      } else {
        console.success("Inicio de sesión exitoso");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      showModal2("Credenciales incorrectas", false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (values) => {
    try {
      setMfaLoading(true);
      
      if (!values.code || !/^\d{6}$/.test(values.code)) {
        throw new Error("El código debe tener 6 dígitos");
      }

      const result = await verifyMFA(userEmail, values.code);
      
      if (result.success) {
        localStorage.setItem("token", result.token);
        navigate("/home");
        showModal2("Inicio de sesión exitoso", true);
        setMfaModalVisible(false);
        mfaForm.resetFields();
      }
    } catch (error) {
      console.error("Error en la verificación MFA:", error);
      showModal2("Error al verificar el código", false);
    } finally {
      setMfaLoading(false);
    }
  };

  const handleCancelMFA = () => {
    setMfaModalVisible(false);
    mfaForm.resetFields();
  };

  return (
    <>
      <Form form={form} onFinish={handleLogin} layout="vertical" className="login-form">
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
          label="Contraseña"
          name="password"
          rules={[
            { required: true, message: "Por favor ingresa tu contraseña" },
            { min: 6, message: "La contraseña debe tener al menos 6 caracteres" }
          ]}
        >
          <Input.Password placeholder="********" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Ingresar
          </Button>
        </Form.Item>
        
        <Text className="register-text">
          <a
            type="link" 
            onClick={() => setModalVisible(true)}
            className="text-blue-600 font-semibold hover:underline p-0"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </Text>
        
        <Text className="register-text">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </Text>
      </Form>
      
      <ResetPass 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />

      <Modal
        title="Verificación en dos pasos"
        visible={mfaModalVisible}
        onCancel={handleCancelMFA}
        footer={null}
        destroyOnClose
      >
        <div style={{ textAlign: "center" }}>
          {otpAuthUrl && (
            <>
              <QRCodeSVG 
                value={otpAuthUrl}
                size={200}
                level="H"
              />
              <p style={{ margin: "16px 0" }}>
                Escanea este código con tu app de autenticación
              </p>
              <p style={{ marginBottom: "16px" }}>
                Código secreto: <Text copyable strong>{otpAuthUrl.split('secret=')[1]?.split('&')[0]}</Text>
              </p>
            </>
          )}
          
          <Form form={mfaForm} onFinish={handleVerifyOTP}>
            <Form.Item
              name="code"
              rules={[
                { required: true, message: "Por favor ingresa el código de verificación" },
                { pattern: /^\d{6}$/, message: "El código debe tener 6 dígitos" }
              ]}
            >
              <Input 
                placeholder="Código de 6 dígitos" 
                maxLength={6}
                autoComplete="off"
              />
            </Form.Item>
            
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              loading={mfaLoading}
            >
              Verificar código
            </Button>
          </Form>
        </div>
      </Modal>
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

export default LoginForm;