import axios from 'axios';

const API_BASE_URL = 'https://momorebackend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// ============ LOCAL PRODUCTS FROM YOUR ASSETS FOLDER ============
// Image names: a.jpeg, b.jpeg, c.jpeg ... z.jpeg, aa.jpeg, bb.jpeg ... ii.jpeg
const localImageNames = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'aa', 'bb', 'cc', 'dd', 'ee', 'ff', 'gg', 'hh', 'ii'
];

const localCategories = ['Clothing', 'Bags & Accessories', 'Homeware', 'Art & Decor', 'Beauty Products', 'Jewelry'];

const localProductNames = {
  'Clothing': ['Silk Dress', 'Cotton Shirt', 'Luxury Blouse', 'Traditional Jacket', 'Modern Skirt', 'Kaftan', 'Dashiki', 'Ankara Top'],
  'Bags & Accessories': ['Leather Handbag', 'Designer Tote', 'Handcrafted Clutch', 'Elegant Backpack', 'Vintage Purse', 'Shoulder Bag', 'Crossbody Bag'],
  'Homeware': ['Modern Vase', 'Ceramic Bowl', 'Decorative Lamp', 'Throw Pillow', 'Wall Art', 'Rug', 'Centerpiece'],
  'Art & Decor': ['Abstract Painting', 'Contemporary Print', 'Traditional Sculpture', 'Modern Canvas', 'Wall Decor', 'Art Print'],
  'Beauty Products': ['Luxury Serum', 'Organic Cream', 'Natural Oil', 'Herbal Mask', 'Essential Set', 'Skincare Kit'],
  'Jewelry': ['Gold Necklace', 'Silver Ring', 'Diamond Earrings', 'Pearl Bracelet', 'Gemstone Set', 'Pendant']
};

const localDescriptions = {
  'Clothing': 'Beautiful handcrafted clothing made with premium African fabrics.',
  'Bags & Accessories': 'Elegant bags and accessories handcrafted by skilled artisans.',
  'Homeware': 'Transform your living space with our unique home decor pieces.',
  'Art & Decor': 'Add character to your walls with our stunning art collection.',
  'Beauty Products': 'Pamper yourself with our natural and organic beauty products.',
  'Jewelry': 'Complete your look with our stunning handcrafted jewelry collection.'
};

// Function to get local image URL (works with Vite)
export const getLocalImageUrl = (imageName: string) => {
  // This tells Vite to include these images in the build
  return new URL(`../assets/${imageName}.jpeg`, import.meta.url).href;
};

// Generate all local products from your images
export const getAllLocalProducts = () => {
  return localImageNames.map((imageName, index) => {
    const category = localCategories[index % localCategories.length];
    const nameList = localProductNames[category];
    const name = nameList[index % nameList.length];
    const price = Math.floor(Math.random() * (199 - 29 + 1) + 29);
    const featured = index < 8;
    const inStock = true;
    
    return {
      _id: `local_${imageName}`,
      name: name,
      description: localDescriptions[category] + ` ${name} - handcrafted with care.`,
      price: price,
      category: category,
      images: [getLocalImageUrl(imageName)],
      featured: featured,
      inStock: inStock,
      stockQuantity: Math.floor(Math.random() * 50) + 1,
      isLocal: true
    };
  });
};

// ============ API ENDPOINTS (with local fallback) ============

export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  adminCodeLogin: (accessCode: string) => api.post('/auth/admin/code-login', { accessCode }),
};

export const productsAPI = {
  // Get all products - combines local + database
  getAll: async (params?: any) => {
    // Always return local products first (so you see them immediately)
    let localProducts = getAllLocalProducts();
    
    // Apply filters to local products
    let filteredLocal = [...localProducts];
    
    if (params?.category && params.category !== 'All Categories') {
      filteredLocal = filteredLocal.filter(p => p.category === params.category);
    }
    
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredLocal = filteredLocal.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply sorting
    if (params?.sort === 'price-low') {
      filteredLocal.sort((a, b) => a.price - b.price);
    } else if (params?.sort === 'price-high') {
      filteredLocal.sort((a, b) => b.price - a.price);
    } else if (params?.sort === 'name') {
      filteredLocal.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 12;
    const start = (page - 1) * limit;
    const paginated = filteredLocal.slice(start, start + limit);
    
    // Try to fetch from database in background and merge (optional)
    try {
      const response = await api.get('/products', { params });
      if (response.data.products && response.data.products.length > 0) {
        // Merge database products with local ones (avoid duplicates)
        const dbProducts = response.data.products.filter(
          (dbp: any) => !filteredLocal.some((lp: any) => lp._id === dbp._id)
        );
        const allProducts = [...paginated, ...dbProducts];
        return {
          data: {
            products: allProducts.slice(0, limit),
            total: filteredLocal.length + dbProducts.length,
            totalPages: Math.ceil((filteredLocal.length + dbProducts.length) / limit),
            currentPage: page
          }
        };
      }
    } catch (error) {
      console.log('Database not available, showing local products only');
    }
    
    // Return local products only
    return {
      data: {
        products: paginated,
        total: filteredLocal.length,
        totalPages: Math.ceil(filteredLocal.length / limit),
        currentPage: page
      }
    };
  },
  
  getById: async (id: string) => {
    // Check if it's a local product
    if (id.startsWith('local_')) {
      const localProducts = getAllLocalProducts();
      const product = localProducts.find(p => p._id === id);
      if (product) {
        return { data: product };
      }
    }
    
    // Try database
    try {
      return await api.get(`/products/${id}`);
    } catch (error) {
      // Fallback to local
      const localProducts = getAllLocalProducts();
      const product = localProducts.find(p => p._id === id);
      if (product) {
        return { data: product };
      }
      throw error;
    }
  },
  
  getFeatured: async () => {
    // Get featured from local
    const localProducts = getAllLocalProducts();
    const featuredLocal = localProducts.filter(p => p.featured);
    
    // Try to get from database too
    try {
      const response = await api.get('/products/featured/list');
      if (response.data && response.data.length > 0) {
        // Merge with local featured (avoid duplicates)
        const dbFeatured = response.data.filter(
          (dbp: any) => !featuredLocal.some((lp: any) => lp._id === dbp._id)
        );
        return { data: [...featuredLocal, ...dbFeatured] };
      }
    } catch (error) {
      console.log('Database featured not available');
    }
    
    return { data: featuredLocal };
  },
  
  create: (formData: FormData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  update: (id: string, formData: FormData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId: string, quantity: number) => api.post('/cart/add', { productId, quantity }),
  update: (productId: string, quantity: number) => api.put('/cart/update', { productId, quantity }),
  remove: (productId: string) => api.delete(`/cart/remove/${productId}`),
  clear: () => api.delete('/cart/clear'),
};

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (productId: string) => api.post('/wishlist/add', { productId }),
  remove: (productId: string) => api.delete(`/wishlist/remove/${productId}`),
  check: (productId: string) => api.get(`/wishlist/check/${productId}`),
};

export const contactAPI = {
  send: (formData: any) => api.post('/contact/send', formData),
};

export const ordersAPI = {
  create: (orderData: any) => api.post('/orders/create', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
};

export default api;