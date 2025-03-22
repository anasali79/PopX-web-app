
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AccountSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "See you soon!",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-light page-transition">
      <div className="max-w-md mx-auto bg-white shadow-sm">
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-dark">Account Settings</h1>
        </div>
        
        <div className="p-5 flex items-center border-b border-dashed border-gray-200">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-purple rounded-full p-1.5 text-white">
              <Camera size={16} />
            </div>
          </div>
          
          <div className="ml-5">
            <h2 className="font-semibold text-lg">Marry Doe</h2>
            <p className="text-gray">Marry@Gmail.Com</p>
          </div>
        </div>
        
        <div className="p-5 border-b border-dashed border-gray-200">
          <p className="text-gray-dark leading-relaxed">
            Lorem Ipsum Dolor Sit Amet, Consetetur Sadipscing Elitr, Sed Diam Nonumy Eirmod Tempor Invidunt Ut Labore Et Dolore Magna Aliquyam Erat, Sed Diam
          </p>
        </div>
        
        <div className="p-5">
          <button 
            onClick={handleLogout}
            className="text-purple hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
