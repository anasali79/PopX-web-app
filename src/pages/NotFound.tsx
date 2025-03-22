
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-light">
      <div className="text-center p-8 bg-white shadow-sm border border-gray-200 rounded-md max-w-md w-full animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 text-gray-dark">404</h1>
        <p className="text-xl text-gray mb-8">Oops! Page not found</p>
        <Link to="/" className="primary-button inline-block">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
