import api from "./api";

  export const flightUser = async (origin, destination, departureDate, adults) => {
    try {
        const response = await api.post("/flights/flights", { origin, destination, departureDate, adults });
        console.log(response.data);
       return response.data;
     } catch (error) {
         throw error.response.data.message;
     }
 };