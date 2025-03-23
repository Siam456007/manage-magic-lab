
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, AuthContextType } from "@/lib/types";
import { mockUser } from "@/lib/data";
import { toast } from "sonner";

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("taskify-user");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  // Login function - in a real app, this would call an API
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple validation
      if (!email || !password) {
        throw new Error("Please provide both email and password");
      }
      
      // In a real app, validate against the backend
      if (email !== "user@example.com" || password !== "password123") {
        throw new Error("Invalid credentials");
      }
      
      // Set the mockUser data for now
      setUser(mockUser);
      localStorage.setItem("taskify-user", JSON.stringify(mockUser));
      
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple validation
      if (!name || !email || !password) {
        throw new Error("Please fill in all fields");
      }
      
      // Password validation
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }
      
      // Create new user
      const newUser = {
        ...mockUser,
        name,
        email,
      };
      
      setUser(newUser);
      localStorage.setItem("taskify-user", JSON.stringify(newUser));
      
      toast.success("Account created successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("taskify-user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

// Protected route wrapper
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

// Public route wrapper - redirects to dashboard if already authenticated
export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return !isAuthenticated ? <>{children}</> : null;
};
