# 🛍️ Manya Closet - E-commerce Platform

A modern, full-stack e-commerce platform built with React and Node.js, featuring comprehensive customer and admin functionality with secure payment integration.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 Overview

Manya Closet is a complete e-commerce solution that provides:
- **Customer-facing features**: Product browsing, shopping cart, wishlist, order management, and secure checkout
- **Admin panel**: Comprehensive dashboard for managing products, inventory, orders, users, payments, and coupons
- **Secure authentication**: JWT-based authentication with role-based access control
- **Payment integration**: Razorpay payment gateway for seamless transactions
- **Modern UI/UX**: Responsive design with Tailwind CSS and custom components

## ✨ Features

### Customer Features
- 🔐 **User Authentication**: Secure registration, login, and password management
- 🛒 **Shopping Cart**: Add, update, and remove items with real-time quantity management
- ❤️ **Wishlist**: Save favorite products for later
- 📦 **Product Browsing**: Browse by categories (Men, Women, Kids) with search and filtering
- 🔍 **Product Search**: Search products by name with real-time filtering
- ⭐ **Product Reviews**: View and submit product reviews and ratings
- 💳 **Secure Checkout**: Multi-step checkout process with address management
- 💰 **Coupon System**: Apply discount coupons during checkout
- 📱 **Order Management**: Track orders, view order history, and download invoices
- 👤 **User Profile**: Manage personal information and addresses
- 📧 **Email Notifications**: Order confirmations and updates via email

### Admin Features
- 📊 **Dashboard**: Overview of sales, orders, users, and revenue
- 🎨 **Product Management**: Create, update, delete, and manage product catalog
- 📦 **Inventory Management**: Track stock levels, update quantities, and manage inventory
- 📋 **Order Management**: View, update order status, and process orders
- 👥 **User Management**: View and manage customer accounts
- 💳 **Payment Management**: Track and manage payment transactions
- 🎟️ **Coupon Management**: Create and manage discount coupons
- ⭐ **Review Management**: Moderate and manage product reviews
- 📄 **Invoice Generation**: Generate PDF invoices for orders

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - UI library
- **React Router DOM 7.6.2** - Client-side routing
- **Vite 6.3.5** - Build tool and dev server
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Razorpay** - Payment gateway integration

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **MongoDB with Mongoose 8.0.3** - Database and ODM
- **JWT (jsonwebtoken 9.0.2)** - Authentication
- **bcrypt 5.1.1** - Password hashing
- **Razorpay 2.9.6** - Payment processing
- **Nodemailer 7.0.12** - Email service
- **PDFKit 0.17.2** - PDF invoice generation
- **CORS 2.8.5** - Cross-origin resource sharing

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** (v8 or higher) or **yarn**
- **MongoDB** (local instance or MongoDB Atlas account)
- **Git**

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Manya_Closet
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## ⚙️ Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/manya_closet
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/manya_closet

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration (for Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## 🏃 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:8000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Seed products (optional)**
   ```bash
   cd backend
   npm run seed:products
   ```

### Production Build

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend**
   ```bash
   cd backend
   npm start
   ```

## 📁 Project Structure

```
Manya_Closet/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── server.js          # Server entry point
│   │   ├── app.js             # Express app configuration
│   │   ├── config/
│   │   │   └── database.js    # MongoDB connection
│   │   ├── models/            # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Cart.js
│   │   │   ├── Order.js
│   │   │   ├── Payment.js
│   │   │   ├── Wishlist.js
│   │   │   ├── Review.js
│   │   │   ├── Coupon.js
│   │   │   ├── Inventory.js
│   │   │   ├── Address.js
│   │   │   └── Category.js
│   │   ├── controllers/       # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js
│   │   │   └── ...
│   │   ├── routes/            # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── adminOrderRoutes.js
│   │   │   └── ...
│   │   ├── middlewares/       # Express middlewares
│   │   │   ├── auth.js
│   │   │   ├── validator.js
│   │   │   ├── errorHandler.js
│   │   │   └── security.js
│   │   └── utils/             # Utility functions
│   │       ├── jwt.js
│   │       ├── emailService.js
│   │       ├── invoiceGenerator.js
│   │       └── seedProducts.js
│   ├── package.json
│   ├── render.yaml            # Render deployment config
│   └── README.md
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── main.jsx           # App entry point
│   │   ├── App.jsx            # Main app component
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar/
│   │   │   ├── Footer/
│   │   │   ├── Hero/
│   │   │   ├── CartItems/
│   │   │   ├── ProductDisplay/
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   │   ├── public/        # Public pages (Shop, Product, Login)
│   │   │   ├── user/          # User pages (Cart, Orders, Profile)
│   │   │   └── admin/         # Admin pages (Dashboard, Products, Orders)
│   │   ├── context/           # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── ShopContext.jsx
│   │   ├── CSS/               # Global styles
│   │   └── App.css
│   ├── public/                # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json            # Vercel deployment config
│   └── README.md
│
└── docs/                       # Documentation
    ├── README.md
    ├── AUTHENTICATION_FLOW.md
    ├── CUSTOMER_FLOW.md
    └── ...
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `GET /api/admin/orders` - Get all orders (Admin)
- `PUT /api/admin/orders/:id` - Update order status (Admin)

### Payments
- `POST /api/payments/create` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `GET /api/admin/payments` - Get all payments (Admin)

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `GET /api/admin/reviews` - Get all reviews (Admin)
- `DELETE /api/admin/reviews/:id` - Delete review (Admin)

### Coupons
- `GET /api/coupons` - Get available coupons
- `POST /api/coupons/validate` - Validate coupon code
- `GET /api/admin/coupons` - Get all coupons (Admin)
- `POST /api/admin/coupons` - Create coupon (Admin)

### Inventory
- `GET /api/admin/inventory` - Get inventory (Admin)
- `PUT /api/admin/inventory/:productId` - Update inventory (Admin)

## 🚀 Deployment

### Backend Deployment (Render)

1. **Connect your repository** to Render
2. **Create a new Web Service**
3. **Configure the service**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. **Add environment variables** from your `.env` file
5. **Deploy**

The `render.yaml` file in the backend directory contains deployment configuration.

### Frontend Deployment (Vercel)

1. **Connect your repository** to Vercel
2. **Configure the project**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Add environment variables**:
   - `VITE_API_URL` - Your backend API URL
   - `VITE_RAZORPAY_KEY_ID` - Your Razorpay key
4. **Deploy**

The `vercel.json` file contains deployment configuration.

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:
- Update `FRONTEND_URL` in backend to your Vercel URL
- Update `VITE_API_URL` in frontend to your Render backend URL
- Use production MongoDB URI
- Use production Razorpay keys
- Configure production email service

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Configured CORS for API security
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Request validation middleware
- **Role-Based Access Control**: Admin and user role separation
- **Secure Payment Processing**: Razorpay integration with webhook verification

## 🧪 Testing

To test the application:

1. **Create a test user account** via registration
2. **Login as admin** (create admin user in database or seed script)
3. **Add products** through admin panel
4. **Browse products** as a customer
5. **Add items to cart** and proceed to checkout
6. **Test payment** using Razorpay test keys

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](docs/LICENSE.md) file for details.

## 👤 Contact

**Manya Shukla**
- Email: shuklamanya99@gmail.com
- Phone: +91 8005586588

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com) - For high-quality product images
- [Flaticon](https://www.flaticon.com) - For icon resources
- [Razorpay](https://razorpay.com) - Payment gateway
- All open-source contributors whose packages made this project possible

---

**Made with ❤️ by Manya Shukla**
