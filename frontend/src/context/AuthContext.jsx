import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL, parseApiResponse } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing login when app starts
  useEffect(() => {
    const token = localStorage.getItem("fraudguard_token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetchCurrentUser(token);
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseApiResponse(response);

      if (!data.success) {
        localStorage.removeItem("fraudguard_token");
        setUser(null);
        return;
      }

      setUser(data.data.user);
    } catch (error) {
      console.error("Auth verification failed:", error);

      localStorage.removeItem("fraudguard_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const login = async (email, password) => {
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
    } catch (netErr) {
      console.error("Login network error:", netErr);
      throw new Error(
        "Unable to connect to the FraudGuard server. Please verify the backend is running."
      );
    }

    const data = await parseApiResponse(response);

    if (!data.success) {
      throw new Error(data.message || "Login failed");
    }

    const token = data.data.token;

    localStorage.setItem("fraudguard_token", token);

    setUser(data.data.user);

    return data;
  };

  // SIGNUP
  const signup = async (name, email, password) => {
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
    } catch (netErr) {
      console.error("Signup network error:", netErr);
      throw new Error(
        "Unable to connect to the FraudGuard server. Please verify the backend is running."
      );
    }

    const data = await parseApiResponse(response);

    if (!data.success) {
      throw new Error(data.message || "Signup failed");
    }

    return data;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("fraudguard_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}