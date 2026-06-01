const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Get today's visitors (implement your visitor tracking logic)
    const todayVisitors = await getTodayVisitors();
    const totalVisitors = await getTotalVisitors();
    
    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      todayVisitors,
      totalVisitors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sales data
router.get('/sales', adminAuth, async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$total" },
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(salesData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;