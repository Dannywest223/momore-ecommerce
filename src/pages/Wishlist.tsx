import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { wishlistAPI, cartAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface WishlistProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
}

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.get();
      setWishlistItems(response.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await wishlistAPI.remove(productId);
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
      toast({
        title: "Removed",
        description: "Product removed from wishlist",
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove product",
        variant: "destructive",
      });
    }
  };

  const addToCart = async (product: WishlistProduct) => {
    setAddingToCart(product._id);
    try {
      await cartAPI.add(product._id, 1);
      toast({
        title: "Added to Cart",
        description: `${product.name} added to your cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(null);
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://via.placeholder.com/200x200?text=No+Image";
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('data:')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-10 w-10 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#3E2723] mb-4">Please Login</h1>
          <p className="text-[#5D4037]/70 mb-6">You need to login to view your wishlist</p>
          <Button asChild className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full">
            <Link to="/admin">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
               {/* Header - Centered */}
               <div className="text-center mb-12">
          {/* Top badge - centered */}
          <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-5 py-2 mb-5 mx-auto">
            <Heart className="h-4 w-4 text-amber-600" />
            <span className="text-amber-700 text-sm font-semibold tracking-wide">MY WISHLIST</span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-3">
            My Wishlist
          </h1>
          
          {/* Decorative underline - centered */}
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full mx-auto mb-3"></div>
          
          {/* Item count */}
          <p className="text-[#5D4037]/70 text-base">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Your wishlist is empty</h2>
            <p className="text-[#5D4037]/70 mb-6">Save your favorite items here</p>
            <Button asChild className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full">
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <Card key={product._id} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-white">
                  <Link to={`/product/${product._id}`}>
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={getImageUrl(product.images?.[0])}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          console.log('Image failed to load:', product.images?.[0]);
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=Image+Not+Found";
                        }}
                      />
                    </div>
                  </Link>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-red-500 text-amber-600 hover:text-white rounded-full p-2 shadow-md transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  
                  {/* Out of Stock Badge */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-5">
                  <p className="text-xs text-amber-600 font-medium mb-1">{product.category}</p>
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-[#3E2723] mb-2 hover:text-amber-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-[#5D4037]/70 mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-amber-600">${product.price}</span>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock || addingToCart === product._id}
                      className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full px-4"
                    >
                      {addingToCart === product._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Stock Status */}
                  {product.inStock && product.stockQuantity < 10 && (
                    <p className="text-xs text-orange-600 mt-2">Only {product.stockQuantity} left!</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;