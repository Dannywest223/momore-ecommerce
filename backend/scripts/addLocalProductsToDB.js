const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import Product model (adjust path as needed)
const Product = require('../models/Product');

// Your local products data (copy from your api.ts)
const localImageNames = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'aa', 'bb', 'cc', 'dd', 'ee', 'ff', 'gg', 'hh', 'ii'
];

const categories = ['Clothing', 'Bags & Accessories', 'Homeware', 'Art & Decor', 'Beauty Products', 'Jewelry'];

const productNames = {
  'Clothing': ['Silk Dress', 'Cotton Shirt', 'Luxury Blouse', 'Traditional Jacket', 'Modern Skirt', 'Kaftan', 'Dashiki', 'Ankara Top'],
  'Bags & Accessories': ['Leather Handbag', 'Designer Tote', 'Handcrafted Clutch', 'Elegant Backpack', 'Vintage Purse', 'Shoulder Bag', 'Crossbody Bag'],
  'Homeware': ['Modern Vase', 'Ceramic Bowl', 'Decorative Lamp', 'Throw Pillow', 'Wall Art', 'Rug', 'Centerpiece'],
  'Art & Decor': ['Abstract Painting', 'Contemporary Print', 'Traditional Sculpture', 'Modern Canvas', 'Wall Decor', 'Art Print'],
  'Beauty Products': ['Luxury Serum', 'Organic Cream', 'Natural Oil', 'Herbal Mask', 'Essential Set', 'Skincare Kit'],
  'Jewelry': ['Gold Necklace', 'Silver Ring', 'Diamond Earrings', 'Pearl Bracelet', 'Gemstone Set', 'Pendant']
};

const descriptions = {
  'Clothing': 'Beautiful handcrafted clothing made with premium African fabrics.',
  'Bags & Accessories': 'Elegant bags and accessories handcrafted by skilled artisans.',
  'Homeware': 'Transform your living space with our unique home decor pieces.',
  'Art & Decor': 'Add character to your walls with our stunning art collection.',
  'Beauty Products': 'Pamper yourself with our natural and organic beauty products.',
  'Jewelry': 'Complete your look with our stunning handcrafted jewelry collection.'
};

// Base URL for images (where images are stored)
const IMAGE_BASE_URL = 'https://momorebackend.onrender.com/uploads/';

const generateProducts = () => {
  return localImageNames.map((imageName, index) => {
    const category = categories[index % categories.length];
    const nameList = productNames[category];
    const name = nameList[index % nameList.length];
    const price = Math.floor(Math.random() * (199 - 29 + 1) + 29);
    const featured = index < 8;
    const inStock = true;
    const stockQuantity = Math.floor(Math.random() * 50) + 1;
    
    return {
      name: name,
      description: descriptions[category] + ` ${name} - handcrafted with care.`,
      price: price,
      category: category,
      images: [`/uploads/${imageName}.jpeg`], // Adjust path as needed
      featured: featured,
      inStock: inStock,
      stockQuantity: stockQuantity,
      sku: `SKU-${imageName.toUpperCase()}`
    };
  });
};

const addProductsToDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const products = generateProducts();
    let added = 0;
    let skipped = 0;
    
    for (const product of products) {
      // Check if product already exists (by name or custom logic)
      const existing = await Product.findOne({ name: product.name });
      if (!existing) {
        await Product.create(product);
        console.log(`✅ Added: ${product.name}`);
        added++;
      } else {
        console.log(`⏭️ Skipped (already exists): ${product.name}`);
        skipped++;
      }
    }
    
    console.log(`\n📊 Summary: ${added} products added, ${skipped} skipped`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addProductsToDB();