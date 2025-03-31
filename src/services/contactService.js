import api from "./api";

export const getLocations = async () => {
    try {
      const response = await api.get("/contact/locations"); 
      console.log("Datos de ubicación recibidos:", response.data);
      return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
  };