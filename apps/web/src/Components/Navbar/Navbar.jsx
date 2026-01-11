import React, { useState } from 'react'
import "./Navbar.css"
import logo from "../../assets/logo.webp"
import cart_icon from "../../assets/cart_icon.png"
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { ShopContext } from '../../Context/ShopContext'

const Navbar = () => {
    const [menu, setMenu] = useState("home")
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { getTotalCartItems } = useContext(ShopContext)
    
    const handleMenuClick = (menuItem) => {
        setMenu(menuItem)
        setMobileMenuOpen(false)
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
                    <li className={`nav-item ${menu === "home" ? "active" : ""}`}>
                        <Link 
                            to="/" 
                            className="nav-link"
                            onClick={() => handleMenuClick("home")}
                        >
                            Home
                        </Link>
                    </li>
                    <li className={`nav-item ${menu === "mens" ? "active" : ""}`}>
                        <Link 
                            to="/mens" 
                            className="nav-link"
                            onClick={() => handleMenuClick("mens")}
                        >
                            Men
                        </Link>
                    </li>
                    <li className={`nav-item ${menu === "womens" ? "active" : ""}`}>
                        <Link 
                            to="/womens" 
                            className="nav-link"
                            onClick={() => handleMenuClick("womens")}
                        >
                            Women
                        </Link>
                    </li>
                    <li className={`nav-item ${menu === "kids" ? "active" : ""}`}>
                        <Link 
                            to="/kids" 
                            className="nav-link"
                            onClick={() => handleMenuClick("kids")}
                        >
                            Kids
                        </Link>
                    </li>
                </ul>

                {/* Login and Cart Section */}
                <div className="nav-actions">
                    <Link to="/login" className="login-link">
                        <button className="login-btn">Login</button>
                    </Link>
                    <Link to="/cart" className="cart-link">
                        <div className="cart-container">
                            <img src={cart_icon} alt="Shopping Cart" className="cart-icon" />
                            {getTotalCartItems() > 0 && (
                                <span className="cart-badge">{getTotalCartItems()}</span>
                            )}
                        </div>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar