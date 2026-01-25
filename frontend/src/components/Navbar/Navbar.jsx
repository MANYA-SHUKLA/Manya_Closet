import React, { useState, useEffect } from 'react'
import "./Navbar.css"
// Using online image URLs
const logo = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&q=80"
const cart_icon = "https://cdn-icons-png.flaticon.com/512/263/263142.png"
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { ShopContext } from '../../context/ShopContext'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
    const [menu, setMenu] = useState("home")
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { getTotalCartItems } = useContext(ShopContext)
    const { isAuthenticated, user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const isAdmin = user?.role === 'admin'
    
    // Sync menu state with current route
    useEffect(() => {
        const path = location.pathname
        if (path === '/') {
            setMenu('home')
        } else if (path === '/cart') {
            setMenu('cart')
        } else if (path === '/wishlist') {
            setMenu('wishlist')
        } else if (path === '/orders') {
            setMenu('orders')
        } else if (path === '/profile') {
            setMenu('profile')
        } else if (path.startsWith('/admin/dashboard')) {
            setMenu('dashboard')
        } else if (path.startsWith('/admin/orders')) {
            setMenu('orders')
        } else if (path.startsWith('/admin/users')) {
            setMenu('users')
        } else if (path === '/mens' || path === '/womens' || path === '/kids') {
            setMenu('categories')
        } else if (path.startsWith('/product')) {
            setMenu('products')
        }
    }, [location.pathname])
    
    const handleMenuClick = (menuItem) => {
        setMenu(menuItem)
        setMobileMenuOpen(false)
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }
    
    // Navigation items based on authentication and role
    const getNavItems = () => {
        if (!isAuthenticated) {
            // Before login: Home | Products | Categories | Login | Signup
            return (
                <>
                    <li className={`nav-item ${menu === "home" ? "active" : ""}`}>
                        <Link 
                            to="/" 
                            className="nav-link"
                            onClick={() => handleMenuClick("home")}
                        >
                            Home
                        </Link>
                    </li>
                    <li className={`nav-item ${menu === "products" ? "active" : ""}`}>
                        <Link 
                            to="/" 
                            className="nav-link"
                            onClick={() => handleMenuClick("products")}
                        >
                            Products
                        </Link>
                    </li>
                    <li className={`nav-item ${menu === "categories" ? "active" : ""}`}>
                        <Link 
                            to="/mens" 
                            className="nav-link"
                            onClick={() => handleMenuClick("categories")}
                        >
                            Categories
                        </Link>
                    </li>
                </>
            )
        } else if (isAdmin) {
            // After login (Admin): Dashboard | Products | Orders | Users | Logout
            return (
                <>
                    <li className={`nav-item ${menu === "dashboard" ? "active" : ""}`}>
                        <Link 
                            to="/admin/dashboard" 
                            className="nav-link"
                            onClick={() => handleMenuClick("dashboard")}
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li className={`nav-item ${menu === "products" ? "active" : ""}`}>
                        <Link 
                            to="/" 
                            className="nav-link"
                            onClick={() => handleMenuClick("products")}
                        >
                            Products
                        </Link>
                    </li>
                    <li className={`nav-item ${menu === "orders" ? "active" : ""}`}>
                        <Link 
                            to="/admin/orders" 
                            className="nav-link"
                            onClick={() => handleMenuClick("orders")}
                        >
                            Orders
                        </Link>
                    </li>
                    <li className={`nav-item ${menu === "users" ? "active" : ""}`}>
                        <Link 
                            to="/admin/users" 
                            className="nav-link"
                            onClick={() => handleMenuClick("users")}
                        >
                            Users
                        </Link>
                    </li>
                </>
            )
        } else {
            // After login (User): Home | Products | Cart | Wishlist | Orders | Profile | Logout
            return (
                <>
                    <li className={`nav-item ${menu === "home" ? "active" : ""}`}>
                        <Link 
                            to="/" 
                            className="nav-link"
                            onClick={() => handleMenuClick("home")}
                        >
                            Home
                        </Link>
                    </li>
                    <li className={`nav-item ${menu === "products" ? "active" : ""}`}>
                        <Link 
                            to="/" 
                            className="nav-link"
                            onClick={() => handleMenuClick("products")}
                        >
                            Products
                        </Link>
                    </li>
                    <li className={`nav-item ${menu === "cart" ? "active" : ""}`}>
                        <Link 
                            to="/cart" 
                            className="nav-link"
                            onClick={() => handleMenuClick("cart")}
                        >
                            Cart
                        </Link>
                    </li>
                    <li className={`nav-item ${menu === "wishlist" ? "active" : ""}`}>
                        <Link 
                            to="/wishlist" 
                            className="nav-link"
                            onClick={() => handleMenuClick("wishlist")}
                        >
                            Wishlist
                        </Link>
                    </li>
                    <li className={`nav-item ${menu === "orders" ? "active" : ""}`}>
                        <Link 
                            to="/orders" 
                            className="nav-link"
                            onClick={() => handleMenuClick("orders")}
                        >
                            Orders
                        </Link>
                    </li>
                    <li className={`nav-item ${menu === "profile" ? "active" : ""}`}>
                        <Link 
                            to="/profile" 
                            className="nav-link"
                            onClick={() => handleMenuClick("profile")}
                        >
                            Profile
                        </Link>
                    </li>
                </>
            )
        }
    }

    const getActionButtons = () => {
        if (!isAuthenticated) {
            // Before login: Login | Signup
            return (
                <>
                    <Link to="/login" className="login-link">
                        <button className="login-btn">Login</button>
                    </Link>
                    <Link to="/login?mode=signup" className="login-link">
                        <button className="login-btn" style={{ backgroundColor: '#667eea', color: 'white' }}>
                            Signup
                        </button>
                    </Link>
                </>
            )
        } else {
            // After login: Show user info and Logout
            return (
                <>
                    {!isAdmin && (
                        <Link to="/cart" className="cart-link">
                            <div className="cart-container">
                                <img src={cart_icon} alt="Shopping Cart" className="cart-icon" />
                                {getTotalCartItems() > 0 && (
                                    <span className="cart-badge">{getTotalCartItems()}</span>
                                )}
                            </div>
                        </Link>
                    )}
                    <div className="user-info" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        marginRight: '8px'
                    }}>
                        <span style={{ 
                            fontSize: '14px', 
                            color: '#667eea',
                            fontWeight: '500'
                        }}>
                            {user?.name || user?.email}
                        </span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="login-btn"
                        style={{ cursor: 'pointer' }}
                    >
                        Logout
                    </button>
                </>
            )
        }
    }
    
    return (
        <nav className='navbar'>
            <div className="navbar-container">
                {/* Logo Section */}
                <Link to="/" className="nav-logo" onClick={() => handleMenuClick("home")}>
                    <img src={logo} alt="Manya Closet Logo" className="logo-image" />
                    <h1 className="brand-name">Manya Closet</h1>
                </Link>

                {/* Mobile Menu Button */}
                <button 
                    className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle mobile menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Navigation Menu */}
                <ul className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    {getNavItems()}
                </ul>

                {/* Action Buttons */}
                <div className="nav-actions">
                    {getActionButtons()}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
