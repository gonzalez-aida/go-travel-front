import api from "./api";

export const registerUser = async (fullName, email, address, password) => {
   try {
       console.log("Registering service " + email);
       const response = await api.post("/auth/register", { fullName, email, address, password });
       console.log(response.data);
      return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
};

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.mfaRequired) {
      return {
          requiresMFA: true,
          otpAuthUrl: response.data.otpauthUrl
      };
  }
  return response.data;
};

export const verifyMFA = async (email, code) => {
  try {
    if (!email || !code) {
      throw new Error("Faltan datos para la verificación");
    }
    
    const response = await api.post('/auth/verify-otp', { 
      email, 
      code 
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      return { success: true, token: response.data.token };
    }
    
    throw new Error(response.data.message || "Error en la verificación");
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al verificar MFA');
  }
};

export const reset = async (email) => {
    try {
        const response = await api.post("/auth/reset", { email });
        console.log(response.data);
        return response.data;
        } catch (error) {
            throw error.response.data.message;
        }
    }

    export const verifyResetCode = async (email, code) => {
        try {
          const response = await api.post("/auth/verify-code", { email, code });
          console.log(response.data);
          return response.data;
        } catch (error) {
          throw error.response.data.message;
        }
      };
      
      export const resetPassword = async (email, code, newPassword) => {
        try {
          const response = await api.post("/auth/reset-password", { 
            email, 
            code, 
            newPassword 
          });
          console.log(response.data);
          return response.data;
        } catch (error) {
          throw error.response.data.message;
        }
      };

export const logoutUser = () => {
localStorage.removeItem("token");
}