const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const { upload } = require('../config/cloudinary'); // Import Cloudinary upload

const router = express.Router();

// Remove the old multer diskStorage configuration since we're using Cloudinary now
// The old storage configuration has been removed

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category && category !== 'All Categories') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (Admin only) - Now using Cloudinary
router.post('/', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, category, featured, stockQuantity } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Get Cloudinary URLs instead of local paths
    const images = req.files.map(file => file.path); // Cloudinary secure URL

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      images, // This will be Cloudinary URLs (https://res.cloudinary.com/...)
      featured: featured === 'true',
      stockQuantity: parseInt(stockQuantity) || 0,
      inStock: parseInt(stockQuantity) > 0
    });

    await product.save();

    // Emit real-time update
    req.io.emit('productAdded', product);

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Update product (Admin only) - Now using Cloudinary
router.put('/:id', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, category, featured, stockQuantity, deleteImages } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? parseFloat(price) : product.price;
    product.category = category || product.category;
    product.featured = featured !== undefined ? featured === 'true' : product.featured;
    product.stockQuantity = stockQuantity ? parseInt(stockQuantity) : product.stockQuantity;
    product.inStock = (product.stockQuantity > 0);

    // Handle image deletion if specified
    if (deleteImages && deleteImages.length > 0) {
      // Remove specified images from the array
      product.images = product.images.filter(img => !deleteImages.includes(img));
    }

    // Handle new images from Cloudinary
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path); // Cloudinary URLs
      product.images = [...product.images, ...newImages];
    }

    await product.save();

    // Emit real-time update
    req.io.emit('productUpdated', product);

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Delete product (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Note: Cloudinary images will persist even after product deletion
    // This is fine as they don't take up much space
    // If you want to delete images from Cloudinary as well, you would need to:
    // 1. Extract public_id from each image URL
    // 2. Call cloudinary.uploader.destroy(public_id)
    
    await Product.findByIdAndDelete(req.params.id);

    // Emit real-time update
    req.io.emit('productDeleted', req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const products = await Product.find({ featured: true, inStock: true }).limit(6);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;