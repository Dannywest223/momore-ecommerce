import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, ShoppingBag, User, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchBar from "@/components/SearchBar";
import { useCartCount, useWishlistCount } from "@/hooks/useCartCount";
import logoImage from "../assets/logo.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cartCount, refreshCartCount } = useCartCount();
  const { wishlistCount, refreshWishlistCount } = useWishlistCount();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    refreshCartCount();
    refreshWishlistCount();
  }, [user]);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const navigationLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      {/* Top Banner - FIXED at top */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white text-center py-2 text-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span>✨ Free shipping on orders over $50</span>
            <span className="hidden md:inline mx-2">|</span>
            <span className="hidden md:inline">Contact: info@momore.com</span>
            <span className="hidden md:inline mx-2">|</span>
            <span className="hidden md:inline">+250 788 123 456</span>
          </div>
        </div>
      </div>

      {/* Main Header - FIXED below top banner */}
      <div className="fixed top-8 left-0 right-0 z-50">
        <div className="bg-[#3E2723] shadow-lg">
          <div className="container mx-auto px-4 py-3">
            {/* Row 1: Logo + Navigation + Icons */}
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <Link to="/" onClick={handleLinkClick} className="flex items-center gap-3 flex-shrink-0">
                <img
                  src={logoImage}
                  alt="MOMORE Logo"
                  className="h-14 md:h-20 w-auto object-contain"
                />
                <div className="hidden sm:block">
                  <span className="text-xl md:text-2xl font-bold text-amber-100 tracking-tight">
                    MOMORE
                  </span>
                  <p className="text-[10px] md:text-xs text-amber-400 -mt-0.5 tracking-wider">LIMITED</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={handleLinkClick}
                    className={`font-medium transition-colors ${
                      isActive(link.path) 
                        ? "text-amber-400" 
                        : "text-amber-100/80 hover:text-amber-300"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Search Bar - Desktop */}
              <div className="hidden lg:block flex-1 max-w-md mx-4">
                <SearchBar />
              </div>

              {/* Desktop Icons with Counters */}
              <div className="hidden lg:flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-amber-100 hover:text-amber-300 hover:bg-amber-800/50 rounded-full relative"
                  asChild
                >
                  <Link to="/wishlist" onClick={handleLinkClick}>
                    <Heart className="h-5 w-5" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                        {wishlistCount > 99 ? '99+' : wishlistCount}
                      </span>
                    )}
                  </Link>
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-amber-100 hover:text-amber-300 hover:bg-amber-800/50 rounded-full relative"
                  asChild
                >
                  <Link to="/cart" onClick={handleLinkClick}>
                    <ShoppingBag className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </Link>
                </Button>
                
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="text-amber-100 hover:text-amber-300 hover:bg-amber-800/50 rounded-full px-3"
                      >
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#4E342E] border border-amber-700 text-white">
                      <DropdownMenuItem className="text-amber-100 hover:text-amber-300 hover:bg-amber-700/50 cursor-pointer">
                        {user.name}
                      </DropdownMenuItem>
                      {user.isAdmin && (
                        <DropdownMenuItem asChild className="text-amber-100 hover:text-amber-300 hover:bg-amber-700/50 cursor-pointer">
                          <Link to="/admin/dashboard" onClick={handleLinkClick}>Admin Dashboard</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={logout}
                        className="text-red-300 hover:text-red-200 hover:bg-red-500/10 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    asChild
                    className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-5"
                  >
                    <Link to="/admin" onClick={handleLinkClick}>Sign In</Link>
                  </Button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-amber-100 hover:text-amber-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>

            {/* Row 2: Search Bar (Mobile + Tablet only) */}
            <div className="lg:hidden mt-3 w-full">
              <SearchBar />
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
              <div className="lg:hidden mt-4 pb-4 border-t border-amber-800/50">
                <div className="flex flex-col space-y-3 pt-4">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`font-medium py-1 ${
                        isActive(link.path) 
                          ? "text-amber-400" 
                          : "text-amber-100/80 hover:text-amber-300"
                      }`}
                      onClick={handleLinkClick}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="flex items-center gap-6 pt-3 border-t border-amber-800/50">
                    <Link to="/wishlist" className="text-amber-100 hover:text-amber-300 relative" onClick={handleLinkClick}>
                      <Heart className="h-5 w-5" />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                          {wishlistCount > 99 ? '99+' : wishlistCount}
                        </span>
                      )}
                    </Link>
                    <Link to="/cart" className="text-amber-100 hover:text-amber-300 relative" onClick={handleLinkClick}>
                      <ShoppingBag className="h-5 w-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      )}
                    </Link>
                    {!user && (
                      <Link to="/admin" className="text-amber-100 hover:text-amber-300" onClick={handleLinkClick}>
                        Sign In
                      </Link>
                    )}
                    {user && (
                      <button onClick={() => { logout(); setIsMenuOpen(false); window.scrollTo(0, 0); }} className="text-red-300 hover:text-red-200">
                        Logout
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer to push content below fixed header */}
      <div className="h-[120px] md:h-[136px]"></div>
    </>
  );
};

export default Header;