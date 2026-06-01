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
    // Handle click outside to close suggestions
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Fetch suggestions when search term changes
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

  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
          className="w-full md:w-80 pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-primary focus:ring-primary"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-white" />
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {suggestions.map((product) => (
              <button
                key={product._id}
                onClick={() => handleProductClick(product._id)}
                className="w-full text-left p-3 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3"
              >
                <img
                  src={product.images[0]?.startsWith('http') 
                    ? product.images[0] 
                    : `http://localhost:5000${product.images[0]}`
                  }
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/48x48?text=Product";
                  }}
                />
                <div className="flex-1">
                  <p className="text-white font-medium">{product.name}</p>
                  <p className="text-gray-400 text-sm">{product.category}</p>
                </div>
                <p className="text-primary font-bold">${product.price}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results found */}
      {showSuggestions && searchTerm.length >= 2 && !loading && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4 text-center text-gray-400">
            No products found for "{searchTerm}"
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4 text-center text-gray-400">
            Searching...
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;