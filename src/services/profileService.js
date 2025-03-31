import api from "./api";

export const getCurrentUserProfile = async () => {
    try {
      const response = await api.get("/profile/profile"); 
      console.log("Datos del usuario recibidos:", response.data);
      return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
  };

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put("/profile/edit-profile", profileData);
    return response.data;
  } catch (error) {
    throw error.response.data.message || "Error al actualizar el perfil";
  }
};
