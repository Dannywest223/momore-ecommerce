import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { productsAPI } from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  description: string;
}

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length >= 2) {
        setLoading(true);
        try {
          const response = await productsAPI.getAll({ search: searchTerm, limit: 5 });
          setSuggestions(response.data.products || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setShowSuggestions(false);
    setSearchTerm("");
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://via.placeholder.com/48x48?text=Product";
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('data:')) return imagePath;
    if (imagePath.startsWith('/src/assets/')) return imagePath;
    return `https://momorebackend.onrender.com${imagePath}`;
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-gray-800 placeholder:text-gray-400 shadow-sm transition-all duration-300"
        />
        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute right-3.5 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-amber-500 transition-colors" />
          </button>
        )}
      </form>

      {/* Suggestions Dropdown - White Theme */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {suggestions.map((product) => (
              <button
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                className="w-full text-left p-3 hover:bg-amber-50 rounded-lg transition-colors flex items-center gap-3"
              >
                <img
                  src={getImageUrl(product.images?.[0])}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/48x48?text=Product";
                  }}
                />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium line-clamp-1">{product.name}</p>
                  <p className="text-gray-500 text-sm">{product.category}</p>
                </div>
                <p className="text-amber-600 font-bold">${product.price}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results found - White Theme */}
      {showSuggestions && searchTerm.length >= 2 && !loading && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
          <div className="p-4 text-center text-gray-500">
            No products found for "<span className="text-amber-600 font-medium">{searchTerm}</span>"
          </div>
        </div>
      )}

      {/* Loading state - White Theme */}
      {loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
          <div className="p-4 text-center text-amber-600">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600 mr-2"></div>
            Searching...
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;