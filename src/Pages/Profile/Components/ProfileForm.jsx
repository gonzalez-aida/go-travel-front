import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import "../../../styles/Profile/ProfileForm.css";
import { getCurrentUserProfile, updateUserProfile } from "../../../services/profileService";
import { toast } from 'react-toastify';

const ProfileForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

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
        toast.success("Guardado exitoso");
      } catch (error) {
        toast.error("Error al cargar los datos del usuario");
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
      message.success("Perfil actualizado correctamente"); 
    } catch (error) {
      message.error(error.message || "Error al actualizar el perfil");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};

export default ProfileForm;