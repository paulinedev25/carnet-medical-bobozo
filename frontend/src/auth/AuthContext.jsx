import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser);
      parsedUser.role = parsedUser.role?.toLowerCase(); // ✅ normalisation
      setUser(parsedUser);
      setToken(savedToken);
    }
  }, []);

  const loginUser = (data) => {
    if (!data?.utilisateur) return;
    const normalizedUser = {
      ...data.utilisateur,
      role: data.utilisateur.role?.toLowerCase(), // ✅ normalisation
    };
    setUser(normalizedUser);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", data.token);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
