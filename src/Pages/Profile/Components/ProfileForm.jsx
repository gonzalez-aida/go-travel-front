import React, { useEffect, useState } from "react";
import { Form, Input, Button, Modal } from "antd"; 
import "../../../styles/Profile/ProfileForm.css";
import { getCurrentUserProfile, updateUserProfile } from "../../../services/profileService";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const ProfileForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [modal, setModal] = useState({ visible: false, message: "", success: false });

  const showModal2 = (message, success) => {
    setModal({ visible: true, message, success });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await getCurrentUserProfile();
        setUserData(data);
        
        form.setFieldsValue({
          fullName: data.fullName || '', 
          email: data.email || '',
          address: data.address || '' 
        });
      } catch (error) {
        showModal2("Error al cargar los datos", false);
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [form]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const updatedData = {
        fullName: values.fullName,
        email: values.email,
        ...(values.address && { address: values.address }) 
      };

      await updateUserProfile(updatedData);
      showModal2("Actualización exitosa", true);
    } catch (error) {
      showModal2("Error al actualizar datos", false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form 
        form={form}
        layout="vertical" 
        className="profile-form"
        onFinish={onFinish}
        initialValues={userData}
      >
        <Form.Item 
          label="Nombre completo" 
          name="fullName"
          rules={[{ required: true, message: 'Por favor ingrese su nombre completo' }]}
        >
          <Input placeholder="Nombre completo..." disabled={loading} />
        </Form.Item>

        <Form.Item 
          label="Correo electrónico" 
          name="email"
          rules={[
            { required: true, message: 'Por favor ingrese su email' },
            { type: 'email', message: 'Ingrese un email válido' }
          ]}
        >
          <Input 
            type="email" 
            placeholder="Correo electrónico" 
            prefix={<i className="fa fa-envelope" />} 
            disabled={loading}
          />
        </Form.Item>

        <div className="location-fields">
          <Form.Item label="Dirección" name="address">
            <Input placeholder="Dirección" disabled={loading} />
          </Form.Item>
        </div>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            className="save-button"
            loading={loading}
          >
            Guardar
          </Button>
        </Form.Item>
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

export default ProfileForm;