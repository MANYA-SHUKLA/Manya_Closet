import React, { useState } from 'react'
import "./Navbar.css"
import logo from "../../assets/logo.webp"
import cart_icon from "../../assets/cart_icon.png"
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { ShopContext } from '../../Context/ShopContext'

const Navbar = () => {
    const [menu, setMenu] = useState("home")
    const { getTotalCartItems } = useContext(ShopContext)
    
    return (
        <nav className='navbar'>
            <div className="navbar-container">
                {/* Logo Section */}
                <div className="nav-logo">
                    <img src={logo} alt="Manya Closet Logo" className="logo-image" />
                    <h1 className="brand-name">Manya Closet</h1>
                </div>

                {/* Navigation Menu */}
                <ul className='nav-menu'>
                    <li className={`nav-item ${menu === "home" ? "active" : ""}`}>
                        <Link 
                            to="/" 
                            className="nav-link"
                            onClick={() => setMenu("home")}
                        >
                            Home
                        </Link>
                    </li>
                    <li className={`nav-item ${menu === "mens" ? "active" : ""}`}>
                        <Link 
                            to="/mens" 
                            className="nav-link"
                            onClick={() => setMenu("mens")}
                        >
                            Men
                        </Link>
                    </li>
                    <li className={`nav-item ${menu === "womens" ? "active" : ""}`}>
                        <Link 
                            to="/womens" 
                            className="nav-link"
                            onClick={() => setMenu("womens")}
                        >
                            Women
                        </Link>
                    </li>
                    <li className={`nav-item ${menu === "kids" ? "active" : ""}`}>
                        <Link 
                            to="/kids" 
                            className="nav-link"
                            onClick={() => setMenu("kids")}
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