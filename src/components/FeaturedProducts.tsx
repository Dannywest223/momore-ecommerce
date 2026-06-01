import { useState, useEffect } from "react";
import { Heart, ShoppingBag, Sparkles, ArrowRight, Star, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { productsAPI, cartAPI, wishlistAPI, getAllLocalProducts } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { useToast } from "@/hooks/use-toast";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { socket } = useSocket();
  const { toast } = useToast();

  // Fallback image
  const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Crect width='500' height='500' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

  // Function to check if image URL is valid
  const isValidImageUrl = (url: string) => {
    if (!url) return false;
    if (url.startsWith('data:')) return true;
    if (url.startsWith('http')) return true;
    if (url.includes('blob:')) return true;
    if (url.startsWith('/src/assets/')) return true;
    // Check if it's a local image name pattern
    if (url.match(/^[a-zA-Z0-9_-]+\.(jpeg|jpg|png|gif)$/i)) return true;
    return false;
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('productAdded', () => fetchFeaturedProducts());
      socket.on('productUpdated', () => fetchFeaturedProducts());
      socket.on('productDeleted', () => fetchFeaturedProducts());

      return () => {
        socket.off('productAdded');
        socket.off('productUpdated');
        socket.off('productDeleted');
      };
    }
  }, [socket]);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      
      // ONLY use local products (these always have working images)
      const localProducts = getAllLocalProducts();
      const localFeatured = localProducts.filter(p => p.featured).slice(0, 10);
      
      setFeaturedProducts(localFeatured);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      const localProducts = getAllLocalProducts();
      setFeaturedProducts(localProducts.filter(p => p.featured).slice(0, 10));
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      await cartAPI.add(productId, 1);
      toast({
        title: "Added to Cart",
        description: "Product added to your cart successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      await wishlistAPI.add(productId);
      toast({
        title: "Added to Wishlist",
        description: "Product added to your wishlist successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to wishlist",
        variant: "destructive",
      });
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return FALLBACK_IMAGE;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('data:')) return imagePath;
    if (imagePath.includes('blob:')) return imagePath;
    if (imagePath.startsWith('/src/assets/')) return imagePath;
    // For local images with just filename
    if (imagePath.match(/^[a-zA-Z0-9_-]+\.(jpeg|jpg|png|gif)$/i)) {
      try {
        return new URL(`../assets/${imagePath}`, import.meta.url).href;
      } catch (e) {
        return FALLBACK_IMAGE;
      }
    }
    return FALLBACK_IMAGE;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-white to-amber-50/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          <p className="text-[#5D4037]/70 mt-4">Loading featured products...</p>
        </div>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <div className="bg-gradient-to-b from-white to-amber-50/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#5D4037]/70">No featured products available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gradient-to-b from-white to-amber-50/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span className="text-amber-700 text-sm font-medium">BEST SELLERS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-3">
            Featured Products
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto rounded-full"></div>
          <p className="text-[#5D4037]/70 max-w-2xl mx-auto mt-4">
            Discover our carefully curated selection of premium products
          </p>
        </div>

        {/* Amazon-style Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {featuredProducts.map((product, idx) => (
            <div key={product._id || idx} className="group relative pb-4">
              {/* Product Image */}
              <Link to={`/product/${product._id}`} className="block">
                <div className="bg-white border border-amber-100 rounded-md overflow-hidden">
                  <img
                    src={getImageUrl(product.images?.[0])}
                    alt={product.name}
                    className="w-full aspect-square object-contain p-6 hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      console.log(`Failed to load image for: ${product.name} - using fallback`);
                      (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
              </Link>

              {/* Wishlist Button */}
              <button
                onClick={() => handleAddToWishlist(product._id)}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-amber-50"
              >
                <Heart className="h-4 w-4 text-gray-500 hover:text-amber-600" />
              </button>

              {/* Product Info */}
              <div className="mt-3 space-y-1">
                <p className="text-xs text-amber-600 font-medium">{product.category}</p>

                <Link to={`/product/${product._id}`}>
                  <h3 className="text-sm font-medium text-[#3E2723] hover:text-amber-600 line-clamp-2 min-h-[40px]">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 text-gray-300" />
                  </div>
                  <span className="text-xs text-[#5D4037]/70">(124)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-[#5D4037]/70">$</span>
                  <span className="text-lg font-bold text-amber-600">{product.price}</span>
                </div>

                {/* Stock Status */}
                {product.inStock && product.stockQuantity > 0 ? (
                  <p className="text-xs text-green-600">In Stock</p>
                ) : (
                  <p className="text-xs text-red-500">Out of Stock</p>
                )}

                {/* Free Shipping */}
                <p className="text-xs text-amber-600 font-medium">FREE Shipping</p>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product._id)}
                  disabled={!product.inStock}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium text-sm py-2 rounded-full transition-all duration-300 mt-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            className="bg-transparent border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white rounded-full px-8 py-2 transition-all duration-300"
            asChild
          >
            <Link to="/shop" className="flex items-center gap-2">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;