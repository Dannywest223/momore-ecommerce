import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Eye, EyeOff, KeyRound, Shield, Sparkles, ArrowRight, Store, Gem, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import logoImage from "../assets/logo.jpg";

const Admin = () => {
  const navigate = useNavigate();
  const { login, register, adminLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [adminCode, setAdminCode] = useState("");
  const { toast } = useToast();

  // Regular customer login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(loginData.email, loginData.password);
      toast({
        title: "Welcome Back!",
        description: "Login successful. Redirecting...",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Regular customer registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      await register(registerData.name, registerData.email, registerData.password);
      toast({
        title: "Welcome to MOMORE!",
        description: "Your account has been created successfully!",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Admin access code login
  const handleAdminCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminLogin(adminCode);
      toast({
        title: "Admin Access Granted",
        description: "Welcome to Admin Dashboard!",
      });
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast({
        title: "Access Denied",
        description: error.message || "Invalid access code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-amber-100/30">
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-5xl">
          {/* Landscape Form - Left Side Branding, Right Side Form */}
          <div className="grid md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Left Side - Branding Section (Brown Theme) */}
            <div className="relative bg-gradient-to-br from-[#3E2723] via-[#4E342E] to-[#2C1A16] p-8 flex flex-col justify-center items-center text-center">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                {/* Logo */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl"></div>
                      <div className="relative h-28 w-28 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden border-2 border-amber-400">
                        <img
                          src={logoImage}
                          alt="MOMORE Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent mb-2">
                  MOMORE
                </h1>
                <p className="text-amber-200/80 mb-4">Luxury Collection</p>
                
                <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto my-6 rounded-full"></div>
                
                <p className="text-amber-100/80 text-sm leading-relaxed">
                  Experience the epitome of luxury with our curated collection of premium products. 
                  Join us on a journey of elegance and sophistication.
                </p>
                
                <div className="mt-8 flex justify-center space-x-4">
                  <div className="text-center">
                    <Gem className="h-6 w-6 text-amber-300 mx-auto mb-2" />
                    <p className="text-xs text-amber-200">Premium Quality</p>
                  </div>
                  <div className="text-center">
                    <Crown className="h-6 w-6 text-amber-300 mx-auto mb-2" />
                    <p className="text-xs text-amber-200">Luxury Brand</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form Section (White Theme) */}
            <div className="bg-white p-8 md:p-10">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-3 py-1 mb-4">
                  <Sparkles className="h-3 w-3 text-amber-600" />
                  <span className="text-amber-700 text-xs font-medium">WELCOME</span>
                </div>
                <h2 className="text-2xl font-bold text-[#3E2723]">Welcome Back</h2>
                <p className="text-[#5D4037]/60 text-sm mt-1">Please sign in to your account</p>
              </div>

              <Tabs defaultValue="customer-login" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-amber-50 p-1 rounded-xl gap-1 mb-6">
                  <TabsTrigger 
                    value="customer-login" 
                    className="data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm rounded-lg transition-all duration-300 text-[#5D4037] text-sm"
                  >
                    <LogIn className="h-3 w-3 mr-1" />
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="customer-register" 
                    className="data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm rounded-lg transition-all duration-300 text-[#5D4037] text-sm"
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Register
                  </TabsTrigger>
                  <TabsTrigger 
                    value="admin-access" 
                    className="data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm rounded-lg transition-all duration-300 text-[#5D4037] text-sm"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </TabsTrigger>
                </TabsList>

                {/* Customer Login Tab */}
                <TabsContent value="customer-login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#3E2723] mb-1">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={loginData.email}
                        onChange={handleLoginInputChange}
                        required
                        placeholder="customer@example.com"
                        className="w-full border-amber-200 focus:border-amber-500 focus:ring-amber-500 bg-amber-50/30 rounded-lg h-11"
                        disabled={loading}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-[#3E2723] mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={handleLoginInputChange}
                          required
                          placeholder="Enter your password"
                          className="w-full pr-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500 bg-amber-50/30 rounded-lg h-11"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500 hover:text-amber-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="rounded border-amber-300 text-amber-600 focus:ring-amber-500" />
                        <span className="ml-2 text-sm text-[#5D4037]">Remember me</span>
                      </label>
                      <button type="button" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                        Forgot password?
                      </button>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md hover:shadow-xl transition-all duration-300 rounded-lg h-11"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Signing in...
                        </div>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-[#5D4037]/70">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          const registerTab = document.querySelector('[value="customer-register"]') as HTMLElement;
                          if (registerTab) registerTab.click();
                        }}
                        className="text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Create one
                      </button>
                    </p>
                  </div>
                </TabsContent>

                {/* Customer Register Tab */}
                <TabsContent value="customer-register">
                  <form onSubmit={handleRegister} className="space-y-3">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#3E2723] mb-1">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={registerData.name}
                        onChange={handleRegisterInputChange}
                        required
                        placeholder="John Doe"
                        className="w-full border-amber-200 focus:border-amber-500 focus:ring-amber-500 bg-amber-50/30 rounded-lg h-11"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label htmlFor="register-email" className="block text-sm font-medium text-[#3E2723] mb-1">
                        Email Address
                      </label>
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        value={registerData.email}
                        onChange={handleRegisterInputChange}
                        required
                        placeholder="hello@example.com"
                        className="w-full border-amber-200 focus:border-amber-500 focus:ring-amber-500 bg-amber-50/30 rounded-lg h-11"
                        disabled={loading}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="register-password" className="block text-sm font-medium text-[#3E2723] mb-1">
                        Password
                      </label>
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        value={registerData.password}
                        onChange={handleRegisterInputChange}
                        required
                        placeholder="Create a strong password"
                        className="w-full border-amber-200 focus:border-amber-500 focus:ring-amber-500 bg-amber-50/30 rounded-lg h-11"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-[#3E2723] mb-1">
                        Confirm Password
                      </label>
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterInputChange}
                        required
                        placeholder="Confirm your password"
                        className="w-full border-amber-200 focus:border-amber-500 focus:ring-amber-500 bg-amber-50/30 rounded-lg h-11"
                        disabled={loading}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md hover:shadow-xl transition-all duration-300 rounded-lg h-11 mt-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating account...
                        </div>
                      ) : (
                        <>
                          Create Account
                          <Sparkles className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-[#5D4037]/70">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          const loginTab = document.querySelector('[value="customer-login"]') as HTMLElement;
                          if (loginTab) loginTab.click();
                        }}
                        className="text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </TabsContent>

                {/* Admin Access Tab */}
                <TabsContent value="admin-access">
                  <form onSubmit={handleAdminCodeLogin} className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-3">
                        <Shield className="h-8 w-8 text-amber-600" />
                      </div>
                      <p className="text-[#5D4037] text-sm">
                        Enter your secure access code to manage the store
                      </p>
                    </div>

                    <div>
                      <label htmlFor="adminCode" className="block text-sm font-medium text-[#3E2723] mb-1">
                        Admin Access Code
                      </label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                        <Input
                          id="adminCode"
                          type={showAdminCode ? "text" : "password"}
                          value={adminCode}
                          onChange={(e) => setAdminCode(e.target.value)}
                          required
                          placeholder="Enter access code"
                          className="pl-10 pr-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500 bg-amber-50/30 font-mono rounded-lg h-11"
                          disabled={loading}
                          autoFocus
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500 hover:text-amber-600"
                          onClick={() => setShowAdminCode(!showAdminCode)}
                        >
                          {showAdminCode ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-amber-500 text-xs mt-2">
                        Default code: MOMORE2024
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md hover:shadow-xl transition-all duration-300 rounded-lg h-11"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Verifying...
                        </div>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Access Dashboard
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <p className="text-amber-700 text-xs text-center">
                      🔐 This area is restricted to authorized personnel only
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-[#5D4037]/50 text-xs">
              © 2024 MOMORE. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;