import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, ShoppingBag, User, LogOut, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchBar from "@/components/SearchBar";
import logoImage from "../assets/logo.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navigationLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      {/* Top Banner - Brown themed */}
      <div className="bg-gradient-to-r from-amber-900/90 via-amber-800/90 to-amber-900/90 text-white text-center py-2.5 text-sm font-medium">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span className="text-amber-100">✨ Free shipping on orders over $50</span>
            <span className="hidden md:inline mx-2 text-amber-600">|</span>
            <span className="hidden md:inline text-amber-100">Contact: info@momore.com</span>
            <span className="hidden md:inline mx-2 text-amber-600">|</span>
            <span className="hidden md:inline text-amber-100">+250 788 123 456</span>
            <Sparkles className="h-3 w-3 text-amber-300 hidden sm:inline" />
          </div>
        </div>
      </div>

      {/* Main Header - Premium Brown */}
      <header className="bg-gradient-to-b from-[#4E342E] to-[#3E2723] border-b border-amber-800/30 sticky top-0 z-50 shadow-xl">
        <nav className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo - Premium Branding */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative">
                {/* Animated ring effect */}
                <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl group-hover:bg-amber-500/30 transition-all duration-300"></div>
                <div className="absolute inset-0 rounded-full border border-amber-500/30 group-hover:border-amber-500/50 transition-all duration-300"></div>
                <div className="relative h-11 w-11 md:h-14 md:w-14 flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-600 to-amber-700 shadow-lg group-hover:scale-105 transition-all duration-300">
                  <img
                    src={logoImage}
                    alt="MOMORE Logo"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent tracking-tight">
                  MOMORE
                </span>
                <p className="text-[10px] md:text-xs text-amber-300/70 -mt-0.5 tracking-wider">LUXURY COLLECTION</p>
              </div>
            </Link>

            {/* Desktop Navigation - Premium styling */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative font-medium transition-all duration-300 group ${
                    isActive(link.path) 
                      ? "text-amber-200" 
                      : "text-amber-100/70 hover:text-amber-200"
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 transform transition-transform duration-300 rounded-full ${
                    isActive(link.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}></span>
                </Link>
              ))}
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-md">
              <SearchBar />
            </div>

            {/* Desktop Icons - Premium styling */}
            <div className="hidden md:flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-amber-100/70 hover:text-amber-200 hover:bg-amber-500/10 transition-all duration-300 rounded-full"
                asChild
              >
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-amber-100/70 hover:text-amber-200 hover:bg-amber-500/10 transition-all duration-300 rounded-full relative"
                asChild
              >
                <Link to="/cart">
                  <ShoppingBag className="h-5 w-5" />
                </Link>
              </Button>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-amber-100/70 hover:text-amber-200 hover:bg-amber-500/10 transition-all duration-300 rounded-full"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#4E342E] border border-amber-700/50 text-white shadow-2xl rounded-xl">
                    <DropdownMenuItem className="text-amber-100 hover:text-amber-200 hover:bg-amber-500/20 font-medium cursor-pointer rounded-lg">
                      {user.name}
                    </DropdownMenuItem>
                    {user.isAdmin && (
                      <DropdownMenuItem asChild className="text-amber-100 hover:text-amber-200 hover:bg-amber-500/20 cursor-pointer rounded-lg">
                        <Link to="/admin/dashboard">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={logout}
                      className="text-red-300 hover:text-red-200 hover:bg-red-500/10 cursor-pointer rounded-lg"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="default" 
                  asChild
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 ml-2"
                >
                  <Link to="/admin">Sign In</Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-amber-100/70 hover:text-amber-200 hover:bg-amber-500/10 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden mt-4">
            <SearchBar />
          </div>

          {/* Mobile Navigation - Premium styling */}
          {isMenuOpen && (
            <div className="md:hidden mt-5 pb-6 border-t border-amber-800/30 animate-slide-down">
              <div className="flex flex-col space-y-4 pt-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`font-medium transition-all duration-300 hover:text-amber-200 hover:pl-3 ${
                      isActive(link.path) 
                        ? "text-amber-200 border-l-3 border-amber-400 pl-3" 
                        : "text-amber-100/70 hover:text-amber-200"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="flex items-center justify-around pt-5 border-t border-amber-800/30 mt-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-amber-100/70 hover:text-amber-200 hover:bg-amber-500/10 rounded-full"
                    asChild
                  >
                    <Link to="/wishlist">
                      <Heart className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-amber-100/70 hover:text-amber-200 hover:bg-amber-500/10 rounded-full"
                    asChild
                  >
                    <Link to="/cart">
                      <ShoppingBag className="h-5 w-5" />
                    </Link>
                  </Button>
                  {user ? (
                    <Button 
                      variant="ghost" 
                      onClick={logout}
                      className="text-red-300 hover:text-red-200 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      asChild
                      className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 rounded-full px-5"
                    >
                      <Link to="/admin">Sign In</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Add custom styles */}
      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .border-l-3 {
          border-left-width: 3px;
        }
      `}</style>
    </>
  );
};

export default Header;
