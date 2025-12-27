// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // 🔄 Charger les infos utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser);
      parsedUser.role = parsedUser.role?.toLowerCase(); // normalisation
      setUser(parsedUser);
      setToken(savedToken);
    }
  }, []);

  // 🔑 Login : stocke token + utilisateur
  const loginUser = (data) => {
    if (!data?.utilisateur || !data?.token) return;

    const normalizedUser = {
      ...data.utilisateur,
      role: data.utilisateur.role?.toLowerCase(),
    };

    setUser(normalizedUser);
    setToken(data.token);

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", data.token);
  };

  // 🚪 Logout : supprime tout
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🧩 Hook pratique pour récupérer le context
export const useAuth = () => useContext(AuthContext);
