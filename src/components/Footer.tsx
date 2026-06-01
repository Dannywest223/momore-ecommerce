import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const shopLinks = [
    { name: "Clothing", href: "/shop/clothing" },
    { name: "Bags & Accessories", href: "/shop/bags" },
    { name: "Homeware", href: "/shop/homeware" },
    { name: "Art & Decor", href: "/shop/art" },
    { name: "All Products", href: "/shop" },
  ];

  const informationLinks = [
    { name: "About Us", href: "/about" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Artisan Stories", href: "/artisans" },
    { name: "Shipping & Returns", href: "/shipping" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#3E2723] to-[#2C1A16] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="space-y-5">
            <Link to="/" className="inline-block">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  MOMORE
                </span>
              </div>
            </Link>
            <p className="text-amber-100/70 leading-relaxed text-sm">
              "Cultural Elegance, Crafted for You." Celebrating African heritage through beautifully handmade products that tell stories of tradition and artistry.
            </p>
            <div className="flex space-x-3 pt-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-amber-300 hover:text-white hover:bg-amber-500/20 rounded-full transition-all duration-300"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-amber-300 hover:text-white hover:bg-amber-500/20 rounded-full transition-all duration-300"
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-amber-300 hover:text-white hover:bg-amber-500/20 rounded-full transition-all duration-300"
              >
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-amber-300 relative inline-block">
              Shop
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-amber-100/60 hover:text-amber-300 transition-all duration-300 text-sm flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information Links */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-amber-300 relative inline-block">
              Information
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {informationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-amber-100/60 hover:text-amber-300 transition-all duration-300 text-sm flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-amber-300 relative inline-block">
              Contact Us
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <Mail className="h-4 w-4 text-amber-400" />
                </div>
                <span className="text-amber-100/70 text-sm group-hover:text-amber-300 transition-colors">info@momore.com</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <Phone className="h-4 w-4 text-amber-400" />
                </div>
                <span className="text-amber-100/70 text-sm group-hover:text-amber-300 transition-colors">+250 788 123 456</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <MapPin className="h-4 w-4 text-amber-400" />
                </div>
                <span className="text-amber-100/70 text-sm group-hover:text-amber-300 transition-colors">Kigali, Rwanda</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-amber-800/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-amber-100/50 text-xs text-center md:text-left">
              &copy; 2024 MOMORE. All rights reserved. Crafted with <Heart className="h-3 w-3 inline text-amber-400" /> in Africa
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/privacy"
                className="text-amber-100/50 hover:text-amber-300 transition-colors text-xs"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-amber-100/50 hover:text-amber-300 transition-colors text-xs"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-amber-100/50 hover:text-amber-300 transition-colors text-xs"
              >
                Cookie Policy
              </Link>
              <Link
                to="/accessibility"
                className="text-amber-100/50 hover:text-amber-300 transition-colors text-xs"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
