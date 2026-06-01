import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingBag, Minus, Plus, ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { productsAPI, cartAPI, wishlistAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const ProductView = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (user && product) {
      checkWishlistStatus();
    }
  }, [user, product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data);
    } catch (error: any) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Product not found",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await wishlistAPI.check(id);
      setIsInWishlist(response.data.isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (cartLoading) return;
    
    setCartLoading(true);
    try {
      await cartAPI.add(product._id, quantity);
      toast({
        title: "Added to Cart!",
        description: `${quantity} x ${product.name} added to your cart`,
      });
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add product to cart",
        variant: "destructive",
      });
    } finally {
      setCartLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    if (wishlistLoading) return;
    
    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await wishlistAPI.remove(product._id);
        setIsInWishlist(false);
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} removed from your wishlist`,
        });
      } else {
        await wishlistAPI.add(product._id);
        setIsInWishlist(true);
        toast({
          title: "Added to Wishlist",
          description: `${product.name} added to your wishlist`,
        });
      }
    } catch (error: any) {
      console.error('Error updating wishlist:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update wishlist",
        variant: "destructive",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://via.placeholder.com/600x600?text=No+Image";
    if (imagePath.startsWith('http')) return imagePath;
    return `https://momorebackend.onrender.com${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#3E2723] mb-4">Product Not Found</h1>
          <Button asChild className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full">
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  const productImages = product.images?.length ? product.images : [null];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button variant="ghost" className="mb-6 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-full" asChild>
          <Link to="/shop">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images Section */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-white shadow-lg border border-amber-100">
              <img
                src={getImageUrl(productImages[selectedImage])}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x600?text=Image+Not+Found";
                }}
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-amber-500 shadow-md' 
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/80x80?text=No+Image";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-3 py-1 mb-3">
                <Sparkles className="h-3 w-3 text-amber-600" />
                <span className="text-amber-700 text-xs font-medium">{product.category}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-3">
                {product.name}
              </h1>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mb-4"></div>
              <p className="text-3xl font-bold text-amber-600">
                ${product.price}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-[#3E2723] mb-2">Description</h3>
              <p className="text-[#5D4037]/80 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
              {product.stockQuantity > 0 && product.stockQuantity < 10 && (
                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  Only {product.stockQuantity} left
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white border border-amber-200 rounded-full px-3 py-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || cartLoading}
                  className="h-8 w-8 rounded-full hover:bg-amber-50 text-amber-600"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-12 text-center font-medium text-[#3E2723]">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={cartLoading}
                  className="h-8 w-8 rounded-full hover:bg-amber-50 text-amber-600"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <span className="text-sm text-[#5D4037]/70">Quantity</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full h-12 shadow-md hover:shadow-xl transition-all duration-300"
                onClick={handleAddToCart}
                disabled={!product.inStock || cartLoading}
              >
                {cartLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </div>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className={`rounded-full h-12 w-12 border-2 transition-all duration-300 ${
                  isInWishlist 
                    ? 'border-red-500 text-red-500 bg-red-50' 
                    : 'border-amber-200 text-amber-600 hover:border-red-500 hover:text-red-500'
                }`}
              >
                {wishlistLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                  <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                )}
              </Button>
            </div>

            {/* Product Information Card */}
            <Card className="border border-amber-100 shadow-md rounded-xl">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-[#3E2723] mb-4">Product Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-amber-100">
                    <span className="text-[#5D4037]">Category</span>
                    <span className="font-medium text-[#3E2723]">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-amber-100">
                    <span className="text-[#5D4037]">SKU</span>
                    <span className="font-medium text-[#3E2723]">{product.sku || product._id?.slice(-8) || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[#5D4037]">Stock Status</span>
                    <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.inStock ? `${product.stockQuantity} units available` : 'Out of Stock'}
                    </span>
                  </div>
                  {product.featured && (
                    <div className="flex justify-between py-2">
                      <span className="text-[#5D4037]">Featured</span>
                      <Badge className="bg-amber-100 text-amber-700 border-0">Featured Product</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <div className="flex flex-wrap gap-4 text-sm pt-4">
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                <span>Free shipping on orders $50+</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                <span>30-day returns</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
