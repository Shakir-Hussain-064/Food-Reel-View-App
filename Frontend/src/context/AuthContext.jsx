import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [foodPartner, setFoodPartner] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  axios.defaults.baseURL = "http://localhost:3000/api";
  axios.defaults.withCredentials = true;
 
  useEffect(() => {
    // You can add logic here to verify the token and get user/food partner info
    // For now, we'll just set the token from local storage
  }, []);

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post("/auth/user/login", { email, password });
      const { user, token } = response.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);
      return user;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await axios.get("/auth/user/logout", { withCredentials: true });
    } catch (e) {
      // ignore network errors, still clear client state
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  const loginFoodPartner = async (email, password) => {
    try {
      const response = await axios.post("/auth/food-partner/login", { email, password });
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
      await axios.get("/auth/food-partner/logout", { withCredentials: true });
    } catch (e) {
      // ignore
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
