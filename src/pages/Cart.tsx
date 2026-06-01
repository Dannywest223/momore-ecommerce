import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { cartAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get();
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    try {
      const response = await cartAPI.update(productId, newQuantity);
      setCartItems(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const response = await cartAPI.remove(productId);
      setCartItems(response.data);
      toast({
        title: "Item Removed",
        description: "Item removed from cart successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCartItems([]);
      toast({
        title: "Cart Cleared",
        description: "All items removed from cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://via.placeholder.com/80x80?text=No+Image";
    if (imagePath.startsWith('http')) return imagePath;
    return `https://momorebackend.onrender.com${imagePath}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-10 w-10 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#3E2723] mb-4">Please Login</h1>
          <p className="text-[#5D4037]/70 mb-6">You need to login to view your cart</p>
          <Button asChild className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full px-8">
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
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span className="text-amber-700 text-sm font-medium">YOUR CART</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-2">Shopping Cart</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
          <p className="text-[#5D4037]/70 mt-4">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Your cart is empty</h2>
            <p className="text-[#5D4037]/70 mb-6">Add some products to get started</p>
            <Button asChild className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full px-8">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.product._id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Product Image */}
                      <Link to={`/product/${item.product._id}`} className="flex-shrink-0">
                        <img
                          src={getImageUrl(item.product.images?.[0])}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/80x80?text=Product";
                          }}
                        />
                      </Link>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <Link to={`/product/${item.product._id}`}>
                          <h3 className="text-lg font-semibold text-[#3E2723] hover:text-amber-600 transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-amber-600 mt-1">{item.product.category}</p>
                        <p className="text-2xl font-bold text-amber-600 mt-2">${item.product.price}</p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-amber-50 rounded-full px-3 py-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 rounded-full hover:bg-amber-200"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium text-[#3E2723]">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            className="h-8 w-8 rounded-full hover:bg-amber-200"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.product._id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 rounded-full px-6"
                >
                  Clear Cart
                </Button>
                <Button 
                  variant="outline" 
                  asChild
                  className="border-amber-300 text-amber-600 hover:bg-amber-50 rounded-full px-6"
                >
                  <Link to="/shop" className="flex items-center gap-2">
                    Continue Shopping
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-xl rounded-2xl sticky top-4 bg-gradient-to-br from-white to-amber-50/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-[#3E2723] mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between py-2 border-b border-amber-100">
                      <span className="text-[#5D4037]">Subtotal</span>
                      <span className="font-semibold text-[#3E2723]">${calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-amber-100">
                      <span className="text-[#5D4037]">Shipping</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between pt-4">
                      <span className="text-lg font-bold text-[#3E2723]">Total</span>
                      <span className="text-2xl font-bold text-amber-600">${calculateTotal()}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full py-6 shadow-md hover:shadow-xl transition-all duration-300"
                    asChild
                  >
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>
                  
                  <p className="text-xs text-center text-[#5D4037]/50 mt-4">
                    Free shipping on orders over $50
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
