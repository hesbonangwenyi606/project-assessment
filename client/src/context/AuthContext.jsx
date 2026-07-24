import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("shopsavvy_token"));
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!token) {
      setReady(true);
      return;
    }
    api
      .me(token)
      .then((data) => setUser(data.user))
      .catch(() => {
        // token expired or invalid
        localStorage.removeItem("shopsavvy_token");
        setToken(null);
        setUser(null);
      })
      .finally(() => setReady(true));
  }, [token]);

  async function signup(name, email, password) {
    const data = await api.signup(name, email, password);
    localStorage.setItem("shopsavvy_token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function login(email, password) {
    const data = await api.login(email, password);
    localStorage.setItem("shopsavvy_token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("shopsavvy_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, ready, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
