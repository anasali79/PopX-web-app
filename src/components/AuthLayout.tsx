
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-light p-4">
      <div className="card-container page-transition">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
