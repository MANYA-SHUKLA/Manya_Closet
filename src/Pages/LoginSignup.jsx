import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Sparkles, CheckCircle, X } from 'lucide-react';
import '../CSS/LoginSignup.css';

const LoginSignup = ({ onNavigateHome }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ title: '', message: '' });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNavigateToHome = () => {
    setShowSuccessPopup(false);
    // Call the navigation function passed as prop
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      // Fallback: redirect using window.location if no navigation function provided
      window.location.href = '/home'; // or wherever your home page is
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (isLogin) {
        // Show login success popup
        setPopupMessage({
          title: 'Welcome Back!',
          message: 'You have successfully logged in. Enjoy your session!'
        });
      } else {
        // Show signup success popup
        setPopupMessage({
          title: 'Success!',
          message: 'Account created successfully! Welcome aboard!'
        });
      }
      setShowSuccessPopup(true);
      
      // For signup, auto-redirect after 3 seconds
      if (!isLogin) {
        setTimeout(() => {
          handleNavigateToHome();
        }, 3000);
      } else {
        // For login, just hide popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
      }
    }, 2000);
  };

  const handleSuccessButtonClick = () => {
    if (!isLogin) {
      // If it's signup, navigate to home
      handleNavigateToHome();
    } else {
      // If it's login, just close popup
      setShowSuccessPopup(false);
    }
  };

  const handleLogout = () => {
    setPopupMessage({
      title: 'Goodbye!',
      message: 'You have been successfully logged out. See you soon!'
    });
    setShowSuccessPopup(true);
    // Reset form and switch to login mode
    setFormData({ name: '', email: '', password: '' });
    setIsLogin(true);
    // Auto hide popup after 3 seconds
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
  };

  return (
    <div className="loginsignup">
      {/* Animated background elements */}
      <div className="background-elements">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>

      {/* Floating particles */}
      <div className="floating-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="loginsignup-container">
        <div className="loginsignup-card">
          {/* Header with animated icon */}
          <div className="loginsignup-header">
            <div className="header-icon">
              <Sparkles className="icon-sparkles" />
            </div>
            <h1 className="header-title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="header-subtitle">
              {isLogin ? 'Sign in to continue your journey' : 'Join us for an amazing experience'}
            </p>
          </div>

          <div className="loginsignup-fields">
            {/* Name field - only for signup */}
            {!isLogin && (
              <div className="input-group">
                <div className="input-container">
                  <User className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className="form-input"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <div className="input-container">
                <Mail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-container">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="form-input password-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="submit-arrow" />
                </>
              )}
            </button>
          </div>

          {/* Toggle between login/signup */}
          <div className="toggle-section">
            <p className="toggle-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="toggle-button"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Terms and conditions - only for signup */}
          {!isLogin && (
            <div className="terms-section">
              <input
                type="checkbox"
                id="terms"
                className="terms-checkbox"
                required
              />
              <label htmlFor="terms" className="terms-label">
                By creating an account, you agree to our{' '}
                <a href="#" className="terms-link">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="terms-link">
                  Privacy Policy
                </a>
              </label>
            </div>
          )}
        </div>

        {/* Social login options */}
        <div className="social-login">
          <p className="social-text">Or continue with</p>
          <div className="social-buttons">
            {['Google', 'Facebook', 'Instagram'].map((provider) => (
              <button
                key={provider}
                className="social-button"
              >
                {provider[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Logout button - shown when logged in */}
        <div className="logout-section">
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-overlay">
          <div className="success-popup">
            <div className="success-content">
              <div className="success-icon">
                <CheckCircle className="check-icon" />
              </div>
              <h3 className="success-title">{popupMessage.title}</h3>
              <p className="success-message">{popupMessage.message}</p>
              <button
                onClick={handleSuccessButtonClick}
                className="success-button"
              >
                {!isLogin ? 'Go to Home' : 'Awesome!'}
              </button>
            </div>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="close-button"
            >
              <X className="close-icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginSignup;