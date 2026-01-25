import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, gender, featured, search, page = 1, limit = 50 } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (gender) {
      query.gender = gender;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get products with populated category
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get inventory for each product
    const productsWithStock = await Promise.all(
      products.map(async (product) => {
        const inventory = await Inventory.findOne({ product: product._id });
        const productObj = product.toObject();
        productObj.stock = inventory ? inventory.quantity : 0;
        productObj.inStock = inventory ? inventory.isInStock : false;
        return productObj;
      })
    );
    
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        products: productsWithStock,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching products'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id)
      .populate('category', 'name slug');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Get inventory
    const inventory = await Inventory.findOne({ product: product._id });
    const productObj = product.toObject();
    productObj.stock = inventory ? inventory.quantity : 0;
    productObj.inStock = inventory ? inventory.isInStock : false;
    productObj.availableQuantity = inventory ? inventory.availableQuantity : 0;
    
    res.status(200).json({
      success: true,
      data: {
        product: productObj
      }
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching product'
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      category,
      price,
      compareAtPrice,
      images,
      sku,
      tags,
      gender,
      isFeatured
    } = req.body;
    
    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const productData = {
      name,
      slug,
      description,
      shortDescription,
      category,
      price,
      compareAtPrice,
      images: images || [],
      sku,
      tags: tags || [],
      gender: gender || 'unisex',
      isFeatured: isFeatured || false
    };
    
    const product = await Product.create(productData);
    
    // Create inventory entry
    const inventory = await Inventory.create({
      product: product._id,
      quantity: req.body.stock || 0,
      isInStock: (req.body.stock || 0) > 0
    });
    
    const productObj = product.toObject();
    productObj.stock = inventory.quantity;
    productObj.inStock = inventory.isInStock;
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product: productObj
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    // Handle duplicate slug
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating product'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Update slug if name changed
    if (req.body.name && req.body.name !== product.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Update product
    Object.keys(req.body).forEach(key => {
      if (key !== 'stock' && key !== 'id') {
        product[key] = req.body[key];
      }
    });
    
    await product.save();
    
    // Update inventory if stock is provided
    if (req.body.stock !== undefined) {
      const inventory = await Inventory.findOne({ product: product._id });
      if (inventory) {
        inventory.quantity = req.body.stock;
        inventory.isInStock = req.body.stock > 0;
        await inventory.save();
      } else {
        await Inventory.create({
          product: product._id,
          quantity: req.body.stock,
          isInStock: req.body.stock > 0
        });
      }
    }
    
    const inventory = await Inventory.findOne({ product: product._id });
    const productObj = product.toObject();
    productObj.stock = inventory ? inventory.quantity : 0;
    productObj.inStock = inventory ? inventory.isInStock : false;
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product: productObj
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating product'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Soft delete (set isActive to false)
    product.isActive = false;
    await product.save();
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting product'
    });
  }
};

