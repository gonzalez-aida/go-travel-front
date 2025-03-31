import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Steps, Typography, Divider } from 'antd';
import { reset, verifyResetCode, resetPassword } from '../../../../services/authService';
import { MailOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import '../../../../styles/Login/ResetPass.css'; 

const { Step } = Steps;
const { Text, Title } = Typography;

const ResetPass = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const steps = [
    {
      title: 'Verificación',
      content: (
        <div className="step-content">
          <Title level={4} className="step-title">Ingresa tu correo electrónico</Title>
          <Text className="step-description">
            Te enviaremos un código de verificación a tu correo registrado.
          </Text>
          <Form form={form} layout="vertical">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Por favor ingresa tu correo' },
                { type: 'email', message: 'Ingresa un correo válido' },
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="ejemplo@gmail.com" 
                size="large"
              />
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      title: 'Validación',
      content: (
        <div className="step-content">
          <Title level={4} className="step-title">Verifica tu identidad</Title>
          <Text className="step-description">
            Hemos enviado un código de 6 dígitos a <Text strong>{email}</Text>
          </Text>
          <Form form={form} layout="vertical">
            <Form.Item
              name="code"
              rules={[
                { required: true, message: 'Por favor ingresa el código' },
                { len: 6, message: 'El código debe tener 6 dígitos' },
              ]}
            >
              <Input 
                prefix={<SafetyOutlined />} 
                placeholder="123456" 
                maxLength={6} 
                size="large"
              />
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      title: 'Nueva Contraseña',
      content: (
        <div className="step-content">
          <Title level={4} className="step-title">Crea una nueva contraseña</Title>
          <Text className="step-description">
            Por seguridad, usa una contraseña fuerte y diferente a anteriores.
          </Text>
          <Form form={form} layout="vertical">
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: 'Por favor ingresa la nueva contraseña' },
                { min: 8, message: 'Mínimo 8 caracteres' },
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Nueva contraseña" 
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Por favor confirma tu contraseña' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Las contraseñas no coinciden'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Confirmar contraseña" 
                size="large"
              />
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  const handleNext = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (currentStep === 0) {
        await reset(values.email);
        setEmail(values.email);
        message.success('Código enviado a tu correo electrónico');
        setCurrentStep(1);
      } else if (currentStep === 1) {
        await verifyResetCode(email, values.code);
        setVerificationCode(values.code);
        message.success('Código verificado correctamente');
        setCurrentStep(2);
      } else if (currentStep === 2) {
        await resetPassword(email, verificationCode, values.newPassword);
        message.success('Contraseña restablecida exitosamente');
        onClose();
        form.resetFields();
        setCurrentStep(0);
      }
    } catch (error) {
      message.error(error?.response?.data?.message || error?.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Modal
      title={<Title level={4} style={{ margin: 0 }}>Restablecer contraseña</Title>}
      visible={visible}
      onCancel={() => {
        onClose();
        form.resetFields();
        setCurrentStep(0);
      }}
      footer={null}
      centered
      className="reset-password-modal"
    >
      <Divider />
      
      <Steps current={currentStep} size="small" className="custom-steps">
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div className="modal-content-wrapper">
        {steps[currentStep].content}
      </div>

      <Divider />

      <div className="modal-footer-actions">
        {currentStep > 0 && (
          <Button 
            onClick={handleBack} 
            disabled={loading}
            size="large"
            className="back-button"
          >
            Atrás
          </Button>
        )}
        <Button
          type="primary"
          loading={loading}
          onClick={handleNext}
          size="large"
          className="action-button"
        >
          {currentStep === steps.length - 1 ? 'Restablecer contraseña' : 'Siguiente'}
        </Button>
      </div>
    </Modal>
  );
};

export default ResetPass;
