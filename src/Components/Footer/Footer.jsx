import React from 'react';
import { Link } from 'react-router-dom';
import "./Footer.css";
import logo from "../../assets/logo.webp";
import instagram_icon from "../../assets/instagram.png";
import facebook_icon from "../../assets/facebook.png";
import whatsapp_icon from "../../assets/whatsapp.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer'>
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <Link to="/">
              <img src={logo} alt="Manya Closet Logo" height="40" />
              <h2>Manya Closet</h2>
            </Link>
            <p className="footer-description">
              Discover the latest fashion trends and unique styles at Manya Closet. 
              Your one-stop destination for premium clothing and accessories.
            </p>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className='footer-links'>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/locations">Our Locations</Link></li>
            <li><Link to="/company">Company</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul className='footer-links'>
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/returns">Returns & Exchange</Link></li>
            <li><Link to="/size-guide">Size Guide</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className='footer-social-icons'>
            <a href="https://instagram.com/manyacloset" target="_blank" rel="noopener noreferrer" className="footer-icon-container">
              <img src={instagram_icon} alt="Instagram" height="30" />
            </a>
            <a href="https://facebook.com/manyacloset" target="_blank" rel="noopener noreferrer" className="footer-icon-container">
              <img src={facebook_icon} alt="Facebook" height="30" />
            </a>
            <a href="https://wa.me/your-whatsapp-number" target="_blank" rel="noopener noreferrer" className="footer-icon-container">
              <img src={whatsapp_icon} alt="WhatsApp" height="30" />
            </a>
          </div>
          <div className="footer-contact">
            <p>Email: shuklamanya99@gmail.com</p>
            <p>Phone: +91 8005586588</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <hr />
        <div className="footer-copyright">
          <p>Copyright © {currentYear} Manya Closet - All Rights Reserved</p>
          <div className="footer-bottom-links">
            <Link to="/terms">Terms & Conditions</Link>
            <span className="separator">|</span>
            <Link to="/privacy">Privacy Policy</Link>
            <span className="separator">|</span>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
