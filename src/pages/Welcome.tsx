
import { Link } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const Welcome = () => {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Welcome to PopX",
      description: "Explore our platform to get started",
      duration: 3000,
    });
  }, []);

  return (
    <AuthLayout>
      <div className="p-6 flex flex-col min-h-[600px]">
        <div className="flex-grow flex flex-col justify-center items-start py-12">
          <h1 className="text-4xl font-bold text-gray-dark mb-3 animate-slide-up">
            Welcome to PopX
          </h1>
          <p className="text-gray mb-12 max-w-md animate-slide-up opacity-90">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Let's create amazing experiences together.
          </p>
          
          <div className="w-full space-y-4 mt-auto">
            <Link to="/register" className="block">
              <button className="primary-button animate-slide-up">
                Create Account
              </button>
            </Link>
            
            <Link to="/login" className="block">
              <button className="secondary-button animate-slide-up">
                Already Registered? Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Welcome;
