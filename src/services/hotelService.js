import api from "./api";

export const hotelUser = async (searchParams) => {
    try {
      const response = await api.post("/hotels/hotels", searchParams);
      return response.data;
    } catch (error) {
      throw error.response.data.message;
    }
  };