import api from "./api";

  export const fetchCityAttractions = async (cityName) => {
    try {
      const response = await api.get("/places/city-attractions", {
        params: { city: cityName }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al buscar atracciones";
    }
  };

  export const fetchCityHotels = async (cityName) => {
    try {
      const response = await api.get("/places/city-hotels", {
        params: { city: cityName }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al buscar atracciones";
    }
  };