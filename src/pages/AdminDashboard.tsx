import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, Upload, X, Loader2, Package, TrendingUp, ShoppingBag, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { productsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const categories = ["Clothing", "Bags & Accessories", "Homeware", "Art & Decor", "Beauty Products", "Jewelry"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  const { toast } = useToast();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    featured: false,
    stockQuantity: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  // Real stats from database
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Calculate real product stats
  const totalProducts = products.length;
  const featuredProducts = products.filter(p => p.featured).length;
  const totalStock = products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stockQuantity || 0)), 0);
  const lowStockProducts = products.filter(p => p.stockQuantity > 0 && p.stockQuantity < 10).length;
  const outOfStockProducts = products.filter(p => p.stockQuantity === 0).length;

  // Calculate real category distribution
  const getCategoryDistribution = () => {
    const categoryCount = {};
    products.forEach(product => {
      if (product.category) {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
      }
    });
    
    const colors = ["#8B4513", "#A0522D", "#CD853F", "#D2691E", "#F4A460", "#DEB887"];
    return Object.entries(categoryCount).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  };

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/admin');
      return;
    }
    fetchProducts();
    fetchUsers();
  }, [user, navigate]);

  useEffect(() => {
    if (socket) {
      socket.on('productAdded', () => fetchProducts());
      socket.on('productUpdated', () => fetchProducts());
      socket.on('productDeleted', () => fetchProducts());

      return () => {
        socket.off('productAdded');
        socket.off('productUpdated');
        socket.off('productDeleted');
      };
    }
  }, [socket]);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTotalUsers(data.count || 0);
      } else {
        setTotalUsers(1); // At least admin user
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setTotalUsers(1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    
    const previews = fileArray.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      featured: false,
      stockQuantity: "",
    });
    setSelectedFiles([]);
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImagePreviews([]);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('featured', formData.featured ? 'true' : 'false');
    formDataToSend.append('stockQuantity', formData.stockQuantity);
  
    selectedFiles.forEach(file => {
      formDataToSend.append('images', file);
    });
  
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct._id, formDataToSend);
        toast({
          title: "Product Updated",
          description: "Product updated successfully",
        });
      } else {
        await productsAPI.create(formDataToSend);
        toast({
          title: "Product Created",
          description: "Product created successfully",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      featured: product.featured,
      stockQuantity: product.stockQuantity.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(productId);
        toast({
          title: "Product Deleted",
          description: "Product deleted successfully",
        });
        fetchProducts();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://via.placeholder.com/400x400?text=No+Image";
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const categoryDistribution = getCategoryDistribution();

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-1.5 mb-4">
            <Package className="h-4 w-4 text-amber-600" />
            <span className="text-amber-700 text-sm font-medium">ADMIN PORTAL</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-2">
            Admin Dashboard
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
          <p className="text-[#5D4037]/70 mt-2">Manage your products and inventory</p>
        </div>

        {/* Stats Row 1 - Product Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Total Products</p>
                  <p className="text-3xl font-bold mt-1">{totalProducts}</p>
                </div>
                <Package className="h-10 w-10 text-amber-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#5D4037] text-sm">Featured Products</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">{featuredProducts}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-amber-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#5D4037] text-sm">Total Stock</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">{totalStock}</p>
                </div>
                <ShoppingBag className="h-10 w-10 text-amber-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#5D4037] text-sm">Inventory Value</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">${totalValue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-10 w-10 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Row 2 - Additional Product Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#5D4037] text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">{totalUsers}</p>
                </div>
                <Users className="h-10 w-10 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#5D4037] text-sm">Low Stock Items</p>
                  <p className="text-3xl font-bold text-orange-500 mt-1">{lowStockProducts}</p>
                </div>
                <ShoppingBag className="h-10 w-10 text-orange-400" />
              </div>
              <p className="text-xs text-[#5D4037]/60 mt-2">Products with &lt;10 units</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#5D4037] text-sm">Out of Stock</p>
                  <p className="text-3xl font-bold text-red-500 mt-1">{outOfStockProducts}</p>
                </div>
                <Package className="h-10 w-10 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Avg. Product Value</p>
                  <p className="text-3xl font-bold mt-1">${totalProducts > 0 ? (totalValue / totalProducts).toFixed(2) : '0'}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-amber-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section - Using Real Product Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution Pie Chart - Real Data */}
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[#3E2723]">Products by Category</CardTitle>
              <p className="text-[#5D4037]/60 text-sm">Distribution across categories</p>
            </CardHeader>
            <CardContent>
              {categoryDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-16 text-[#5D4037]/60">
                  No product data available. Add products to see distribution.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stock Overview Bar Chart */}
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-[#3E2723]">Stock Overview</CardTitle>
              <p className="text-[#5D4037]/60 text-sm">Inventory status by category</p>
            </CardHeader>
            <CardContent>
              {categoryDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #FCD34D" }}
                      labelStyle={{ color: "#3E2723" }}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="#CD853F" radius={[8, 8, 0, 0]} name="Number of Products" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-16 text-[#5D4037]/60">
                  No product data available. Add products to see chart.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Product Button */}
        <div className="flex justify-end mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6"
                onClick={resetForm}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-amber-600">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="text-[#3E2723] font-medium">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product name"
                    className="mt-1 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-[#3E2723] font-medium">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    placeholder="Describe your product..."
                    className="mt-1 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="price" className="text-[#3E2723] font-medium">Price ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      placeholder="0.00"
                      className="mt-1 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stockQuantity" className="text-[#3E2723] font-medium">Stock Quantity</Label>
                    <Input
                      id="stockQuantity"
                      name="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      required
                      placeholder="0"
                      className="mt-1 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category" className="text-[#3E2723] font-medium">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-amber-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                      disabled={isSubmitting}
                      className="data-[state=checked]:bg-amber-500"
                    />
                    <Label htmlFor="featured" className="text-[#3E2723] font-medium cursor-pointer">
                      Featured Product
                    </Label>
                  </div>
                  <span className="text-xs text-[#5D4037]">Featured products appear on homepage</span>
                </div>

                <div>
                  <Label htmlFor="images" className="text-[#3E2723] font-medium">Product Images</Label>
                  <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="images" className="cursor-pointer">
                      <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">Click to upload images</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB (max 5 images)</p>
                    </label>
                  </div>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          disabled={isSubmitting}
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                    className="border-gray-300 hover:bg-gray-50 rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md rounded-full px-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {editingProduct ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingProduct ? 'Update Product' : 'Create Product'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product._id} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
                <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-white">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={getImageUrl(product.images?.[0])}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=No+Image";
                      }}
                    />
                  </div>
                  {product.featured && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white border-0 shadow-md">
                      Featured
                    </Badge>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="default"
                      size="icon"
                      onClick={() => handleEdit(product)}
                      className="h-8 w-8 bg-white hover:bg-amber-50 text-amber-600 shadow-md rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="icon"
                      onClick={() => handleDelete(product._id)}
                      className="h-8 w-8 bg-white hover:bg-red-50 text-red-500 shadow-md rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-5">
                  <Badge variant="secondary" className="mb-2 bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 rounded-full">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold text-[#3E2723] mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-[#5D4037]/70 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-amber-600">${product.price}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${product.stockQuantity > 0 ? (product.stockQuantity < 10 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600') : 'bg-red-100 text-red-600'}`}>
                      {product.stockQuantity > 0 ? (product.stockQuantity < 10 ? `Low Stock: ${product.stockQuantity}` : `Stock: ${product.stockQuantity}`) : 'Out of Stock'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No products yet</h2>
            <p className="text-gray-400 mb-6">Start by adding your first product</p>
            <Button 
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;