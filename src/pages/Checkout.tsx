import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, MapPin, User, Phone, ShoppingBag, Sparkles, Truck, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { cartAPI, ordersAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [shippingData, setShippingData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Rwanda",
    phone: "",
  });

  useEffect(() => {
    if (!user) {
      navigate('/admin');
      return;
    }
    fetchCart();
    loadFlutterwaveScript();
  }, [user, navigate]);

  const loadFlutterwaveScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    document.body.appendChild(script);
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://via.placeholder.com/80x80?text=No+Image";
    if (imagePath.startsWith('http')) return imagePath;
    return `https://momorebackend.onrender.com${imagePath}`;
  };

  const handlePayment = async () => {
    if (!shippingData.fullName || !shippingData.address || !shippingData.city || !shippingData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required shipping information",
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    const total = calculateTotal();

    const paymentData = {
      public_key: "FLWPUBK_TEST-your-test-key",
      tx_ref: `tx-${Date.now()}`,
      amount: total,
      currency: "USD",
      payment_options: "card,mobilemoney,ussd",
      customer: {
        email: user.email,
        phone_number: shippingData.phone,
        name: shippingData.fullName,
      },
      customizations: {
        title: "MOMORE Store",
        description: "Payment for your order",
        logo: "https://your-logo-url.com/logo.png",
      },
      callback: async (response: any) => {
        if (response.status === "successful") {
          try {
            const orderData = {
              items: cartItems.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
              })),
              totalAmount: total,
              shippingAddress: shippingData,
              paymentReference: response.tx_ref
            };

            await ordersAPI.create(orderData);

            toast({
              title: "Payment Successful!",
              description: "Your order has been placed successfully",
            });

            navigate('/');
          } catch (error) {
            toast({
              title: "Order Error",
              description: "Payment successful but failed to create order. Please contact support.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Payment Failed",
            description: "Your payment was not successful. Please try again.",
            variant: "destructive",
          });
        }
        setProcessing(false);
      },
      onclose: () => {
        setProcessing(false);
      },
    };

    if (window.FlutterwaveCheckout) {
      window.FlutterwaveCheckout(paymentData);
    } else {
      toast({
        title: "Payment Error",
        description: "Payment system not loaded. Please refresh and try again.",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#3E2723] mb-4">Your cart is empty</h1>
          <p className="text-[#5D4037]/70 mb-6">Add some products to your cart before checking out</p>
          <Button 
            onClick={() => navigate('/shop')}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full px-8"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span className="text-amber-700 text-sm font-medium">SECURE CHECKOUT</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-2">Checkout</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Information - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-white border-b border-amber-100">
                <CardTitle className="flex items-center text-[#3E2723]">
                  <MapPin className="h-5 w-5 mr-2 text-amber-600" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="fullName" className="text-[#3E2723] font-medium mb-2 block">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                      <Input
                        id="fullName"
                        name="fullName"
                        value={shippingData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="pl-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-[#3E2723] font-medium mb-2 block">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={shippingData.phone}
                        onChange={handleInputChange}
                        placeholder="+250 788 123 456"
                        className="pl-10 border-amber-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-[#3E2723] font-medium mb-2 block">
                    Street Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={shippingData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className="border-amber-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="city" className="text-[#3E2723] font-medium mb-2 block">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingData.city}
                      onChange={handleInputChange}
                      placeholder="Kigali"
                      className="border-amber-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-[#3E2723] font-medium mb-2 block">
                      State/Province
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      value={shippingData.state}
                      onChange={handleInputChange}
                      placeholder="Kigali City"
                      className="border-amber-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="zipCode" className="text-[#3E2723] font-medium mb-2 block">
                      ZIP / Postal Code
                    </Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={shippingData.zipCode}
                      onChange={handleInputChange}
                      placeholder="00000"
                      className="border-amber-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-[#3E2723] font-medium mb-2 block">
                      Country
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      value={shippingData.country}
                      onChange={handleInputChange}
                      placeholder="Rwanda"
                      className="border-amber-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Info Card */}
            <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-r from-amber-50 to-white">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-6 justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Truck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-[#3E2723]">Free Shipping</p>
                      <p className="text-xs text-[#5D4037]/70">On orders over $50</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-[#3E2723]">Secure Payment</p>
                      <p className="text-xs text-[#5D4037]/70">100% secure transactions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-[#3E2723]">Easy Returns</p>
                      <p className="text-xs text-[#5D4037]/70">30-day return policy</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary - Right Column */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg rounded-2xl sticky top-24">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-white border-b border-amber-100">
                <CardTitle className="flex items-center text-[#3E2723]">
                  <ShoppingBag className="h-5 w-5 mr-2 text-amber-600" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.product._id} className="flex gap-4 pb-4 border-b border-amber-100 last:border-0">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={getImageUrl(item.product.images?.[0])}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg border border-amber-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/64x64?text=Product";
                          }}
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#3E2723] text-sm">{item.product.name}</h4>
                        <p className="text-xs text-amber-600 mt-1">{item.product.category}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-[#5D4037]/70">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-semibold text-amber-600">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4 bg-amber-100" />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5D4037]">Subtotal</span>
                    <span className="font-medium text-[#3E2723]">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5D4037]">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5D4037]">Tax</span>
                    <span className="font-medium text-[#3E2723]">$0.00</span>
                  </div>
                  <Separator className="my-2 bg-amber-200" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-[#3E2723]">Total</span>
                    <span className="text-amber-600">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Card */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-white border-b border-amber-100">
                <CardTitle className="flex items-center text-[#3E2723]">
                  <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-center gap-3 mb-4">
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold">VISA</div>
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold">MC</div>
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold">AMEX</div>
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold">MTN</div>
                  </div>
                  
                  <p className="text-sm text-[#5D4037]/70 text-center">
                    Secure payment powered by Flutterwave. We accept all major credit cards and mobile money.
                  </p>
                  
                  <Button
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full h-12 shadow-md hover:shadow-xl transition-all duration-300"
                    onClick={handlePayment}
                    disabled={processing}
                  >
                    {processing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Pay $${calculateTotal().toFixed(2)}`
                    )}
                  </Button>
                  
                  <p className="text-xs text-[#5D4037]/50 text-center">
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
