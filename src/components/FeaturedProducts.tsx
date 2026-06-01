import { useState, useEffect } from "react";
import { Heart, ShoppingBag, Sparkles, ArrowRight, Star, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { productsAPI, cartAPI, wishlistAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { useToast } from "@/hooks/use-toast";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { socket } = useSocket();
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('productAdded', (product) => {
        if (product.featured) {
          setFeaturedProducts(prev => [product, ...prev].slice(0, 6));
        }
      });

      socket.on('productUpdated', (product) => {
        setFeaturedProducts(prev => 
          prev.map(p => p._id === product._id ? product : p)
        );
      });

      socket.on('productDeleted', (productId) => {
        setFeaturedProducts(prev => prev.filter(p => p._id !== productId));
      });

      return () => {
        socket.off('productAdded');
        socket.off('productUpdated');
        socket.off('productDeleted');
      };
    }
  }, [socket]);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getFeatured();
      setFeaturedProducts(response.data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
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
    if (!imagePath) return "https://via.placeholder.com/400x400?text=No+Image";
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
            <p className="text-xl text-[#5D4037]/70">Loading featured products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-amber-50/30">
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

        {/* Products Grid - Amazon Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card
              key={product._id}
              className="group bg-white border border-gray-100 hover:border-amber-200 hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl h-full flex flex-col"
            >
              {/* Image Container - Amazon style with full image visibility */}
              <div className="relative bg-gradient-to-br from-amber-50 to-white p-6">
                <Link to={`/product/${product._id}`} className="block">
                  <div className="aspect-square w-full overflow-hidden rounded-lg">
                    <img
                      src={getImageUrl(product.images?.[0])}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=Product";
                      }}
                    />
                  </div>
                </Link>
                
                {/* Quick View Button (Amazon style) */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-3">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-11/12 mx-auto block bg-white text-[#3E2723] hover:bg-amber-500 hover:text-white rounded-full text-xs"
                    asChild
                  >
                    <Link to={`/product/${product._id}`}>
                      <Eye className="h-3 w-3 mr-1" />
                      Quick View
                    </Link>
                  </Button>
                </div>
                
                {/* Wishlist Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-amber-500 text-amber-500 hover:text-white rounded-full shadow-sm h-8 w-8 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  onClick={() => handleAddToWishlist(product._id)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                
                {/* Featured Badge */}
                {product.featured && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                    Featured
                  </div>
                )}
              </div>
              
              {/* Content - Amazon Style */}
              <CardContent className="p-4 flex-grow flex flex-col space-y-2">
                {/* Category */}
                <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">
                  {product.category}
                </p>
                
                {/* Product Name */}
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-semibold text-[#3E2723] text-sm hover:text-amber-600 transition-colors line-clamp-2 min-h-[40px]">
                    {product.name}
                  </h3>
                </Link>
                
                {/* Rating (Amazon style) */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">(128 reviews)</span>
                </div>
                
                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-gray-500">$</span>
                  <span className="text-xl font-bold text-amber-600">{product.price}</span>
                </div>
                
                {/* Stock Status */}
                {product.inStock && product.stockQuantity > 0 ? (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="text-xs text-green-600">
                      In Stock - {product.stockQuantity} left
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <p className="text-xs text-red-500">Out of Stock</p>
                  </div>
                )}
                
                {/* Free Shipping Badge */}
                <p className="text-xs text-amber-600 font-medium mt-1">
                  FREE Shipping
                </p>
                
                {/* Add to Cart Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg py-2 h-auto text-sm font-medium transition-all duration-300 mt-3"
                  onClick={() => handleAddToCart(product._id)}
                  disabled={!product.inStock}
                >
                  <ShoppingBag className="h-3.5 w-3.5 mr-2" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </CardContent>
            </Card>
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
    </section>
  );
};

export default FeaturedProducts;