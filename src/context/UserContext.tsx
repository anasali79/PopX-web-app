
import React, { createContext, useState, useContext, useEffect } from "react";

type User = {
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  isAgency: string;
};

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user data exists in localStorage on initial load
    const storedUser = localStorage.getItem("popx_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Store user data in localStorage
    localStorage.setItem("popx_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Remove user data from localStorage
    localStorage.removeItem("popx_user");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
