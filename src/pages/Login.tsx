
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
  const { login, isAuthenticated } = useUser();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/account");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Get all items from localStorage
      const userData = localStorage.getItem("popx_user");
      
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        
        // Check if the email matches
        if (parsedUserData.email === email) {
          // Login successful
          login(parsedUserData);
          
          toast({
            title: "Login successful",
            description: "Welcome back to PopX!",
          });
          
          setIsLoading(false);
          navigate("/account");
        } else {
          throw new Error("Invalid email or password");
        }
      } else {
        throw new Error("No registered account found");
      }
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
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
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Login"}
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
