
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import FormInput from "@/components/FormInput";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated, isLoading: authLoading } = useUser();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/account");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      console.log("Attempting login with:", email);
      await login(email, password);
      // Navigation is handled in the useEffect when isAuthenticated changes
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-dark mb-3 animate-slide-up">
            Signin to your PopX account
          </h1>
          <p className="text-gray animate-slide-up">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <FormInput
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-purple text-white font-medium rounded-md hover:bg-purple/90 transition-all duration-200 animate-slide-up"
              disabled={isLoading || authLoading}
            >
              {isLoading || authLoading ? "Signing in..." : "Login"}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <Link to="/register" className="text-purple hover:underline text-sm">
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
