
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import FormInput from "@/components/FormInput";
import { useToast } from "@/components/ui/use-toast";

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
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "radio" ? e.target.id.split("-")[1] : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      toast({
        title: "Account created successfully",
        description: "Welcome to PopX!",
      });
      setIsLoading(false);
      navigate("/account");
    }, 1500);
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

          <div className="pt-4">
            <button
              type="submit"
              className="primary-button animate-slide-up"
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
