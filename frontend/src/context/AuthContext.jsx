import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import userService from "../services/userService";

const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("access_token");
    return token ? parseJwt(token) : null;
  });

  // Enriquece el usuario con el avatar y otros datos del perfil al cargar la app
  useEffect(() => {
    if (!localStorage.getItem("access_token")) return;
    userService.getMe()
      .then((me) => setUser((prev) => prev ? { ...prev, avatar: me.avatar } : prev))
      .catch(() => {});
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    const tokenUser = parseJwt(data.access);
    setUser(tokenUser);
    // Obtener avatar justo después del login
    userService.getMe()
      .then((me) => setUser((prev) => prev ? { ...prev, avatar: me.avatar } : prev))
      .catch(() => {});
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