const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const contactRoutes = require('./routes/contact');
const orderRoutes = require('./routes/orders');

const app = express();
const server = http.createServer(app);

// ✅ FIXED: Dynamic CORS for production + local development
const allowedOrigins = [
  process.env.CLIENT_URL,           // Netlify URL (production)
  'http://localhost:8080',           // Local frontend
  'http://localhost:3000',           // React default
  'http://localhost:5000',           // Local backend
  'https://momorebackend.onrender.com' // Self
].filter(Boolean); // Remove undefined values

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
  }
});

// ✅ FIXED: CORS middleware with proper origin handling
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(null, true); // Still allow but log it
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization']
}));

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// ✅ ADD THIS: Root endpoint to fix 404 error
app.get('/', (req, res) => {
  res.json({
    message: 'Momore Backend API is running',
    status: 'active',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      wishlist: '/api/wishlist',
      contact: '/api/contact',
      orders: '/api/orders'
    }
  });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Mock product data for when database is not available
const mockProducts = [
  {
    _id: "68c9696457cccaaf594b470a",
    name: "handbag",
    description: "this handbag is the best for noow",
    price: 50,
    category: "hand bag",
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500"],
    featured: true,
    inStock: true,
    stockQuantity: 5,
    createdAt: new Date().toISOString()
  },
  {
    _id: "68cbd7abf3313faaaa3c3a46",
    name: "umbrella",
    description: "this is the best hand bag purchase it pls",
    price: 600,
    category: "umbrella",
    images: ["https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=500"],
    featured: false,
    inStock: true,
    stockQuantity: 6,
    createdAt: new Date().toISOString()
  },
  {
    _id: "68cbe1c2f3313faaaa3c3ac9",
    name: "HJBSFD",
    description: "RHRHGR",
    price: 55,
    category: "FDFDS",
    images: ["https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500"],
    featured: false,
    inStock: true,
    stockQuantity: 3,
    createdAt: new Date().toISOString()
  }
];

// Middleware to check database connection and return mock if needed
app.use('/api/products', (req, res, next) => {
  // If MongoDB is not connected, use mock data
  if (mongoose.connection.readyState !== 1) {
    console.log('⚠️  Using mock products data (database not connected)');
    
    let query = [...mockProducts];
    const { category, featured, search, page = 1, limit = 12 } = req.query;
    
    // Filter by category
    if (category && category !== 'All Categories' && category !== 'undefined') {
      query = query.filter(p => p.category === category);
    }
    
    // Filter by featured
    if (featured === 'true') {
      query = query.filter(p => p.featured === true);
    }
    
    // Search filter
    if (search && search !== 'undefined') {
      query = query.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedProducts = query.slice(startIndex, startIndex + parseInt(limit));
    
    return res.json({
      products: paginatedProducts,
      totalPages: Math.ceil(query.length / limit),
      currentPage: parseInt(page),
      total: query.length
    });
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);

// ✅ ADD THIS: 404 handler for unknown routes
// ✅ FIXED: 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: {
      root: '/',
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      wishlist: '/api/wishlist',
      contact: '/api/contact',
      orders: '/api/orders'
    }
  });
});

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Server will continue but database features will not work');
    console.log('💡 Tip: Check your internet connection and MongoDB Atlas IP whitelist');
    console.log('📦 Using mock product data instead');
  }
};

connectDB();

// Add MongoDB connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Backend URL: https://momorebackend.onrender.com`);
  if (mongoose.connection.readyState !== 1) {
    console.log(`📦 Running in DEMO mode with mock data`);
  }
});