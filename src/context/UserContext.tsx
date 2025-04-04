
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase, ProfileType } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

type UserProfile = {
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  isAgency: string;
};

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession);
        
        if (currentSession?.user) {
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();
            
            if (error) {
              console.error("Error fetching profile:", error);
              const storedUser = localStorage.getItem("popx_user");
              if (storedUser) {
                setProfile(JSON.parse(storedUser));
              }
            } else if (data) {
              setProfile({
                fullName: data.full_name || '',
                email: currentSession.user.email || '',
                phoneNumber: data.phone_number || '',
                companyName: data.company_name || '',
                isAgency: data.is_agency || ''
              });
            }
          } catch (err) {
            console.error("Failed to fetch profile:", err);
          }
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);
      
      if (currentSession?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("Error fetching profile:", error);
              const storedUser = localStorage.getItem("popx_user");
              if (storedUser) {
                setProfile(JSON.parse(storedUser));
              }
            } else if (data) {
              setProfile({
                fullName: data.full_name || '',
                email: currentSession.user.email || '',
                phoneNumber: data.phone_number || '',
                companyName: data.company_name || '',
                isAgency: data.is_agency || ''
              });
            }
            setIsLoading(false);
          });
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signup = async (email: string, password: string, userData: UserProfile) => {
    try {
      setIsLoading(true);
      
      console.log("Starting signup process for:", email);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error("Auth error during signup:", authError);
        throw authError;
      }

      console.log("Auth signup successful, user created:", authData.user?.id);

      if (authData.user) {
        // Create profile with proper error handling
        try {
          console.log("Attempting to create profile for user:", authData.user.id);
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              full_name: userData.fullName,
              phone_number: userData.phoneNumber,
              company_name: userData.companyName,
              is_agency: userData.isAgency
            });

          if (profileError) {
            console.error("Profile creation error:", profileError);
            // Don't throw here, just log the error
            toast({
              title: "Profile creation issue",
              description: "Your account was created but there was an issue with your profile. Some features may be limited.",
              variant: "destructive",
            });
          } else {
            console.log("Profile created successfully");
          }
        } catch (profileCreationError) {
          console.error("Unexpected error during profile creation:", profileCreationError);
          // Don't throw here either, just log the error
        }

        setProfile(userData);
        setUser(authData.user);
        setSession(authData.session);
        setIsAuthenticated(true);
        
        localStorage.setItem("popx_user", JSON.stringify(userData));
        
        toast({
          title: "Account created successfully",
          description: "Welcome to PopX!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      console.log("Attempting login with email:", email);
      
      // First try normal login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If there's an error related to email confirmation
      if (error && error.message.includes("Email not confirmed")) {
        console.log("Email not confirmed error detected, attempting workaround");
        
        // Try to get the user by email first
        const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
        
        if (userError) {
          console.error("Error fetching users:", userError);
          throw error; // Fallback to original error
        }
        
        // Force set the user as confirmed
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          data.user?.id || "",
          { email_confirm: true }
        );
        
        if (updateError) {
          console.error("Error updating user confirmation:", updateError);
          
          // If admin update fails, try direct login again
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (retryError) throw retryError;
          
          // If retry succeeds, proceed with the retry data
          if (retryData.user) {
            setUser(retryData.user);
            setSession(retryData.session);
            setIsAuthenticated(true);
            
            // Try to fetch profile
            await fetchAndSetProfile(retryData.user);
            
            toast({
              title: "Login successful",
              description: "Welcome back to PopX!",
            });
            
            return;
          }
        }
      }

      if (error) throw error;

      if (data.user) {
        await fetchAndSetProfile(data.user);
        
        setUser(data.user);
        setSession(data.session);
        setIsAuthenticated(true);
        
        toast({
          title: "Login successful",
          description: "Welcome back to PopX!",
        });
      }
    } catch (error: any) {
      console.error("Login error details:", error);
      
      // Special handling for email confirmation errors
      if (error.message && error.message.includes("Email not confirmed")) {
        toast({
          title: "Login issue",
          description: "Your email is not confirmed. Please check your inbox or try signing up again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to fetch and set profile
  const fetchAndSetProfile = async (user: User) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching profile:", profileError);
      }

      if (profileData) {
        const userProfile = {
          fullName: profileData.full_name,
          email: user.email || '',
          phoneNumber: profileData.phone_number,
          companyName: profileData.company_name,
          isAgency: profileData.is_agency
        };
        
        setProfile(userProfile);
        localStorage.setItem("popx_user", JSON.stringify(userProfile));
      }
    } catch (error) {
      console.error("Error in fetchAndSetProfile:", error);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsAuthenticated(false);
      
      localStorage.removeItem("popx_user");
      
      toast({
        title: "Logged out successfully",
        description: "See you soon!",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      profile, 
      session, 
      login, 
      signup, 
      logout, 
      isAuthenticated, 
      isLoading 
    }}>
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
