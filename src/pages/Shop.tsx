import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, Heart, Grid, List, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productsAPI, wishlistAPI, getLocalImageUrl } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const categories = ["All Categories", "Clothing", "Bags & Accessories", "Homeware", "Art & Decor", "Beauty Products", "Jewelry"];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const itemsPerPage = 12;

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchQuery = searchParams.get("search");
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
    fetchProducts();
  }, [selectedCategory, searchTerm, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
        search: searchTerm || undefined,
        page: currentPage,
        limit: itemsPerPage,
      };
      
      if (sortBy !== 'featured') {
        params.sort = sortBy;
      }
      
      const response = await productsAPI.getAll(params);
      let fetchedProducts = response.data.products || [];
      
      // Sort locally if needed
      if (sortBy === 'price-low') {
        fetchedProducts.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        fetchedProducts.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'name') {
        fetchedProducts.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      setProducts(fetchedProducts);
      setTotalPages(Math.ceil((response.data.total || fetchedProducts.length) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
    if (imagePath.startsWith('data:')) return imagePath;
    if (imagePath.startsWith('/src/assets/') || imagePath.includes('blob:')) return imagePath;
    return imagePath;
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#3E2723] via-[#4E342E] to-[#3E2723] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="text-amber-100 text-sm font-medium">COLLECTION</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Shop Collection</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            Discover our curated selection of premium products
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-amber-100 bg-white shadow-sm sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 bg-white border-amber-200">
                  <SelectValue placeholder="Category" />
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
            
            <div className="flex gap-4 w-full lg:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 bg-white border-amber-200">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="hidden sm:flex gap-2 bg-amber-50 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white" : "text-amber-600"}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white" : "text-amber-600"}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
              <p className="text-xl text-gray-500">Loading products...</p>
            </div>
          ) : (
            <>
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                {products.map((product) => (
                  viewMode === "grid" ? (
                    <Card key={product._id} className="group bg-white border border-amber-100 hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl hover:-translate-y-1">
                      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-white aspect-square">
                        <Link to={`/product/${product._id}`}>
                          <img
                            src={getImageUrl(product.images?.[0])}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=Product";
                            }}
                          />
                        </Link>
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="bg-white/90 text-amber-600 hover:bg-amber-600 hover:text-white rounded-full shadow-md"
                            onClick={() => handleAddToWishlist(product._id)}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        {product.featured && (
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs px-2 py-1 rounded-full">
                            Featured
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-amber-600 font-medium mb-1">{product.category}</p>
                        <Link to={`/product/${product._id}`}>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-amber-600 transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold text-amber-600">${product.price}</p>
                          {product.inStock ? (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">In Stock</span>
                          ) : (
                            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">Out of Stock</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div key={product._id} className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl p-4 border border-amber-100 hover:shadow-lg transition-all duration-300">
                      <Link to={`/product/${product._id}`} className="sm:w-40 h-40 flex-shrink-0">
                        <img
                          src={getImageUrl(product.images?.[0])}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/160x160?text=Product";
                          }}
                        />
                      </Link>
                      <div className="flex-1 flex flex-col">
                        <p className="text-amber-600 text-xs font-medium mb-1">{product.category}</p>
                        <Link to={`/product/${product._id}`}>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-amber-600 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <p className="text-2xl font-bold text-amber-600">${product.price}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddToWishlist(product._id)}
                            className="border-amber-200 text-amber-600 hover:bg-amber-50 rounded-full"
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            Wishlist
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-amber-200 text-amber-600 hover:bg-amber-50 rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => goToPage(pageNum)}
                          className={currentPage === pageNum 
                            ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 rounded-full" 
                            : "border-amber-200 text-amber-600 hover:bg-amber-50 rounded-full"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-amber-200 text-amber-600 hover:bg-amber-50 rounded-full"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
          
          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-500 mb-2">No products found</p>
              <p className="text-gray-400">Try adjusting your search or filter settings</p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All Categories");
                  setSortBy("featured");
                }}
                className="mt-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;