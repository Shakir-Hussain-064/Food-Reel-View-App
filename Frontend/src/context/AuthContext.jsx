import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../config/axios.config";
import toastService from "../services/toast.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [foodPartner, setFoodPartner] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
 
  useEffect(() => {
    // You can add logic here to verify the token and get user/food partner info
    // For now, we'll just set the token from local storage
  }, []);

  const loginUser = async (email, password) => {
    try {
      const response = await apiRequest.post("/auth/user/login", { email, password });
      const { user, token } = response.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);
      return user;
    } catch (error) {
      console.error("User login failed", error);
      throw error;
    }
  };
  
  const logoutUser = async () => {
    try {
      await apiRequest.get("/auth/user/logout");
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout request failed", error);
      // Don't show error toast for logout failures, just continue with client cleanup
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  const loginFoodPartner = async (email, password) => {
    try {
      const response = await apiRequest.post("/auth/food-partner/login", { email, password });
      const { foodPartner, token } = response.data;
      setFoodPartner(foodPartner);
      setToken(token);
      localStorage.setItem("token", token);
      return foodPartner;
    } catch (error) {
      console.error("Food partner login failed", error);
      throw error;
    }
  };

  const logoutFoodPartner = async () => {
    try {
      await apiRequest.get("/auth/food-partner/logout");
      console.log("Food partner logged out successfully");
    } catch (error) {
      console.error("Food partner logout request failed", error);
      // Don't show error toast for logout failures, just continue with client cleanup
    } finally {
      setFoodPartner(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        foodPartner,
        token,
        loginUser,
        logoutUser,
        loginFoodPartner,
        logoutFoodPartner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
