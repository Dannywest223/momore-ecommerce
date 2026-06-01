const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Admin access code from .env
const ADMIN_ACCESS_CODE = process.env.ADMIN_ACCESS_CODE || 'MOMORE2024';

// Register (Customer)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if this is the admin email
    const isAdmin = email === process.env.ADMIN_EMAIL;

    // Create new user
    const user = new User({
      name,
      email,
      password,
      isAdmin
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Regular Login (Customers)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Login with Access Code - THIS IS THE MISSING ENDPOINT
router.post('/admin/code-login', async (req, res) => {
  console.log('🔐 Admin login attempt received');
  console.log('Request body:', req.body);
  
  try {
    const { accessCode } = req.body;

    // Check if access code matches
    if (!accessCode || accessCode !== ADMIN_ACCESS_CODE) {
      console.log('❌ Invalid access code provided');
      return res.status(401).json({ message: 'Invalid access code' });
    }

    console.log('✅ Access code verified');

    // Find or create admin user
    let adminUser = await User.findOne({ isAdmin: true });
    
    if (!adminUser) {
      console.log('📝 Creating new admin user...');
      // Create admin user if doesn't exist
      const hashedPassword = await bcrypt.hash(accessCode, 10);
      adminUser = new User({
        name: "Administrator",
        email: process.env.ADMIN_EMAIL || "admin@momore.com",
        password: hashedPassword,
        isAdmin: true
      });
      await adminUser.save();
      console.log('✅ Admin user created');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: adminUser._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('🎫 Token generated successfully');
    console.log('👑 Admin user:', adminUser.email);

    res.json({
      token,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        isAdmin: true
      }
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isAdmin: req.user.isAdmin
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;