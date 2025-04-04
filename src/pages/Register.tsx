
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import FormInput from "@/components/FormInput";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    companyName: "",
    isAgency: "Yes",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup, isAuthenticated } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "radio" ? e.target.id.split("-")[1] : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    console.log("Submitting registration form with data:", { 
      email: formData.email, 
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      companyName: formData.companyName,
      isAgency: formData.isAgency
    });
    
    try {
      await signup(formData.email, formData.password, {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        companyName: formData.companyName,
        isAgency: formData.isAgency,
      });
      
      console.log("Signup successful, navigating to account page");
      navigate("/account");
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-dark mb-3 animate-slide-up">
            Create your PopX account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            name="fullName"
            type="text"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Phone number"
            name="phoneNumber"
            type="tel"
            placeholder="Enter phone number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Email address"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Company name"
            name="companyName"
            type="text"
            placeholder="Enter company name"
            value={formData.companyName}
            onChange={handleChange}
          />

          <div className="mb-6 animate-slide-up">
            <label className="form-label">
              Are you an Agency?<span className="text-purple">*</span>
            </label>
            <div className="flex items-center space-x-6 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isAgency"
                  id="agency-Yes"
                  checked={formData.isAgency === "Yes"}
                  onChange={handleChange}
                  className="w-5 h-5 text-purple accent-purple"
                />
                <span className="ml-2 text-gray-dark">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isAgency"
                  id="agency-No"
                  checked={formData.isAgency === "No"}
                  onChange={handleChange}
                  className="w-5 h-5 text-purple accent-purple"
                />
                <span className="ml-2 text-gray-dark">No</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-purple text-white font-medium rounded-md hover:bg-purple/90 transition-all duration-200 animate-slide-up"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <Link to="/login" className="text-purple hover:underline text-sm">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Register;
