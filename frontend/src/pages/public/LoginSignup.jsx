import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Sparkles, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../CSS/LoginSignup.css';

const LoginSignup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup, isAuthenticated } = useAuth();
  
  // Check if mode parameter is set in URL, default to login
  const initialMode = searchParams.get('mode') !== 'signup';
  const [isLogin, setIsLogin] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ title: '', message: '' });
  const [error, setError] = useState('');

  // Sync URL parameter with state
  React.useEffect(() => {
    const mode = searchParams.get('mode');
    setIsLogin(mode !== 'signup');
  }, [searchParams]);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      // Get redirect URL from query params, default to home
      const redirectUrl = searchParams.get('redirect') || '/';
      navigate(redirectUrl);
    }
  }, [isAuthenticated, navigate, searchParams]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  const handleNavigateToHome = () => {
    setShowSuccessPopup(false);
    // Get redirect URL from query params, default to home
    const redirectUrl = searchParams.get('redirect') || '/';
    navigate(redirectUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          setPopupMessage({
            title: 'Welcome Back!',
            message: 'You have successfully logged in. Enjoy your session!'
          });
          setShowSuccessPopup(true);
          setTimeout(() => {
            handleNavigateToHome();
          }, 2000);
        } else {
          setError(result.message || 'Login failed. Please check your credentials.');
        }
      } else {
        // Signup
        // Validation
        if (!formData.name || !formData.email || !formData.password) {
          setError('Please fill in all required fields');
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }

        const result = await signup(
          formData.name,
          formData.email,
          formData.password,
          formData.phone || null
        );
        
        if (result.success) {
          setPopupMessage({
            title: 'Success!',
            message: 'Account created successfully! Welcome aboard!'
          });
          setShowSuccessPopup(true);
          setTimeout(() => {
            handleNavigateToHome();
          }, 2000);
        } else {
          setError(result.message || 'Signup failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessButtonClick = () => {
    handleNavigateToHome();
  };

  return (
    <div className="loginsignup">
      
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

          {/* Error message */}
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div className="loginsignup-fields">
            <form onSubmit={handleSubmit}>
              {/* Name field - only for signup */}
              {!isLogin && (
                <div className="field-group">
                  <label htmlFor="name" className="field-label">
                    Full Name
                  </label>
                  <div className="field-input-wrapper">
                    <User className="field-icon" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="field-input"
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div className="field-group">
                <label htmlFor="email" className="field-label">
                  Email Address
                </label>
                <div className="field-input-wrapper">
                  <Mail className="field-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="field-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="field-group">
                <label htmlFor="password" className="field-label">
                  Password
                </label>
                <div className="field-input-wrapper">
                  <Lock className="field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="field-input"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Phone field - only for signup */}
              {!isLogin && (
                <div className="field-group">
                  <label htmlFor="phone" className="field-label">
                    Phone Number (Optional)
                  </label>
                  <div className="field-input-wrapper">
                    <User className="field-icon" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="field-input"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
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
            </form>
          </div>

          {/* Toggle between login/signup */}
          <div className="toggle-section">
            <p className="toggle-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  const newMode = !isLogin;
                  setIsLogin(newMode);
                  setError('');
                  setFormData({ name: '', email: '', password: '', phone: '' });
                  // Update URL without reload
                  navigate(newMode ? '/login' : '/login?mode=signup', { replace: true });
                }}
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
