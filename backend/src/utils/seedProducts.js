import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Inventory from '../models/Inventory.js';

dotenv.config();

// Sample product data - 10 products with high-quality online images
const sampleProducts = [
  {
    name: 'Elegant Floral Kurti',
    categorySlug: 'women',
    price: 50.0,
    compareAtPrice: 80.5,
    gender: 'women',
    description: 'Beautiful traditional kurti perfect for casual and formal occasions. Made with premium cotton fabric.',
    shortDescription: 'Traditional kurti',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=800&fit=crop'
    ],
    stock: 25,
    tags: ['traditional', 'kurti', 'casual'],
    rating: { average: 4.5, count: 12 }
  },
  {
    name: 'Classic Formal Shirt',
    categorySlug: 'men',
    price: 60.0,
    compareAtPrice: 90.5,
    gender: 'men',
    description: 'Classic shirt suitable for office and casual wear. Premium cotton blend fabric.',
    shortDescription: 'Classic men shirt',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=800&fit=crop'
    ],
    stock: 30,
    tags: ['shirt', 'formal', 'casual'],
    rating: { average: 4.3, count: 8 }
  },
  {
    name: 'Designer Silk Saree',
    categorySlug: 'women',
    price: 75.0,
    compareAtPrice: 120.0,
    gender: 'women',
    description: 'Elegant saree for special occasions and celebrations. Handcrafted with intricate designs.',
    shortDescription: 'Elegant saree',
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583394293214-28a15c343b4a?w=800&h=800&fit=crop'
    ],
    stock: 15,
    tags: ['saree', 'traditional', 'formal'],
    rating: { average: 4.7, count: 20 }
  },
  {
    name: 'Slim Fit Trouser',
    categorySlug: 'men',
    price: 90.0,
    compareAtPrice: 140.0,
    gender: 'men',
    description: 'Comfortable trousers perfect for office and casual wear. Modern slim fit design.',
    shortDescription: 'Comfortable trousers',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7d3d1bf8b827?w=800&h=800&fit=crop'
    ],
    stock: 20,
    tags: ['trouser', 'formal', 'pants'],
    rating: { average: 4.2, count: 15 }
  },
  {
    name: 'Premium Cotton T-Shirt',
    categorySlug: 'men',
    price: 45.0,
    compareAtPrice: 70.0,
    gender: 'men',
    description: 'Cool and comfortable t-shirt for everyday wear. 100% organic cotton.',
    shortDescription: 'Cool t-shirt',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop'
    ],
    stock: 40,
    tags: ['tshirt', 'casual', 'cotton'],
    rating: { average: 4.4, count: 25 }
  },
  {
    name: 'Stylish Party Dress',
    categorySlug: 'women',
    price: 85.0,
    compareAtPrice: 130.0,
    gender: 'women',
    description: 'Stylish dress for parties and casual outings. Elegant and comfortable.',
    shortDescription: 'Stylish dress',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1566479179817-4d6e3f4f8e4e?w=800&h=800&fit=crop'
    ],
    stock: 18,
    tags: ['dress', 'party', 'casual'],
    rating: { average: 4.6, count: 30 }
  },
  {
    name: 'Sporty Jogger Pants',
    categorySlug: 'men',
    price: 95.0,
    compareAtPrice: 150.0,
    gender: 'men',
    description: 'Comfortable joggers for gym and casual wear. Flexible and durable.',
    shortDescription: 'Comfortable joggers',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop'
    ],
    stock: 35,
    tags: ['jogger', 'sports', 'casual'],
    rating: { average: 4.3, count: 18 }
  },
  {
    name: 'Yoga Leggings',
    categorySlug: 'women',
    price: 55.0,
    compareAtPrice: 100.0,
    gender: 'women',
    description: 'Comfortable leggings for daily wear and workouts. High-quality stretch fabric.',
    shortDescription: 'Comfortable leggings',
    images: [
      'https://images.unsplash.com/photo-1624378515193-696e3b7c6e7f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7d3d1bf8b827?w=800&h=800&fit=crop'
    ],
    stock: 50,
    tags: ['leggings', 'activewear', 'casual'],
    rating: { average: 4.5, count: 22 }
  },
  {
    name: 'Kids Denim Shirt',
    categorySlug: 'kid',
    price: 85.0,
    compareAtPrice: 140.0,
    gender: 'kids',
    description: 'Stylish denim shirt for kids. Durable and comfortable for active children.',
    shortDescription: 'Kids denim shirt',
    images: [
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=800&fit=crop'
    ],
    stock: 20,
    tags: ['denim', 'shirt', 'kids'],
    rating: { average: 4.4, count: 10 }
  },
  {
    name: 'Kids Cargo Pants',
    categorySlug: 'kid',
    price: 88.0,
    compareAtPrice: 130.0,
    gender: 'kids',
    description: 'Durable cargo pants for active kids. Multiple pockets and comfortable fit.',
    shortDescription: 'Kids cargo pants',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7d3d1bf8b827?w=800&h=800&fit=crop'
    ],
    stock: 22,
    tags: ['cargo', 'pants', 'kids'],
    rating: { average: 4.3, count: 8 }
  }
];

const seedProducts = async () => {
  try {
    await connectDB();
    
    // Create categories if they don't exist
    const categories = {};
    const categorySlugs = ['men', 'women', 'kid'];
    
    for (const slug of categorySlugs) {
      let category = await Category.findOne({ slug });
      if (!category) {
        category = await Category.create({
          name: slug.charAt(0).toUpperCase() + slug.slice(1),
          slug,
          description: `${slug.charAt(0).toUpperCase() + slug.slice(1)} category`
        });
      }
      categories[slug] = category._id;
    }
    
    // Clear existing products (optional - comment out if you want to keep existing)
    // await Product.deleteMany({});
    // await Inventory.deleteMany({});
    
    // Create products
    console.log('Creating products...');
    for (const productData of sampleProducts) {
      // Check if product already exists
      const existingProduct = await Product.findOne({ name: productData.name });
      if (existingProduct) {
        console.log(`Product "${productData.name}" already exists, skipping...`);
        continue;
      }
      
      const categoryId = categories[productData.categorySlug];
      if (!categoryId) {
        console.error(`Category "${productData.categorySlug}" not found`);
        continue;
      }
      
      // Generate slug
      const slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Create product
      const product = await Product.create({
        name: productData.name,
        slug,
        description: productData.description,
        shortDescription: productData.shortDescription,
        category: categoryId,
        price: productData.price,
        compareAtPrice: productData.compareAtPrice,
        images: productData.images,
        tags: productData.tags,
        gender: productData.gender,
        rating: productData.rating
      });
      
      // Create inventory
      await Inventory.create({
        product: product._id,
        quantity: productData.stock,
        isInStock: productData.stock > 0
      });
      
      console.log(`✓ Created product: ${productData.name}`);
    }
    
    console.log('✅ Products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProducts();
}

export default seedProducts;

