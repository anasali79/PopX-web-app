
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";

const AccountSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, logout, isAuthenticated, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, isLoading]);

  const handleLogout = () => {
    logout();
    // Navigation is handled in the UserContext
  };

  // If loading or not authenticated, show loading
  if (isLoading || !isAuthenticated || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-light">
        <div className="animate-pulse text-purple">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-light page-transition">
      <div className="max-w-md mx-auto bg-white shadow-sm">
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-dark">Account Settings</h1>
        </div>
        
        <div className="p-5 flex items-center border-b border-dashed border-gray-200">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              <div className="w-full h-full flex items-center justify-center bg-purple/20 text-purple font-bold text-xl">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-purple rounded-full p-1.5 text-white">
              <Camera size={16} />
            </div>
          </div>
          
          <div className="ml-5">
            <h2 className="font-semibold text-lg">{profile.fullName}</h2>
            <p className="text-gray">{profile.email}</p>
            {profile.phoneNumber && (
              <p className="text-gray text-sm">{profile.phoneNumber}</p>
            )}
          </div>
        </div>
        
        <div className="p-5 border-b border-dashed border-gray-200">
          {profile.companyName && (
            <div className="mb-3">
              <h3 className="font-semibold">Company</h3>
              <p className="text-gray-dark">{profile.companyName}</p>
            </div>
          )}
          <div className="mb-3">
            <h3 className="font-semibold">Agency</h3>
            <p className="text-gray-dark">{profile.isAgency}</p>
          </div>
          <p className="text-gray-dark leading-relaxed mt-3">
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
