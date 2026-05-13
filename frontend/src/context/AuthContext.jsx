// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

// Función para decodificar el JWT y obtener el payload
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Al montar, intenta recuperar el usuario del token guardado
    const token = localStorage.getItem("access_token");
    return token ? parseJwt(token) : null;
  });

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(parseJwt(data.access));
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}