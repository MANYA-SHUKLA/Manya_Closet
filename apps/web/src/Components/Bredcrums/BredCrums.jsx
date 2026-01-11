import React, { useEffect, useRef, useState } from 'react';
import "./BredCrums.css";
import arrow_icon from "../../assets/arrow_icon.png";

const Breadcrumbs = (props) => {
  const { product } = props;
  const [isVisible, setIsVisible] = useState(false);
  const breadcrumbRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (breadcrumbRef.current) {
      observer.observe(breadcrumbRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const breadcrumbItems = [
    { 
      label: 'Home', 
      path: '/', 
      isClickable: true 
    },
    { 
      label: 'Shop', 
      path: '/shop', 
      isClickable: true 
    },
    { 
      label: product?.category || 'Category', 
      path: `/category/${product?.category?.toLowerCase()}`, 
      isClickable: true 
    },
    { 
      label: product?.name || 'Product', 
      path: null, 
      isClickable: false 
    }
  ];

  const handleNavigation = (path) => {
    if (path) {
      // You can replace this with your routing logic
      console.log(`Navigate to: ${path}`);
      // Example: navigate(path) or window.location.href = path
    }
  };

  return (
    <nav 
      className={`breadcrumbs ${isVisible ? 'animate-in' : ''}`} 
      ref={breadcrumbRef}
      aria-label="Breadcrumb navigation"
    >
      <div className="breadcrumbs-container">
        <ol className="breadcrumbs-list">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="breadcrumb-item">
              {item.isClickable ? (
                <button
                  className="breadcrumb-link"
                  onClick={() => handleNavigation(item.path)}
                  aria-current={index === breadcrumbItems.length - 1 ? 'page' : undefined}
                >
                  <span className="breadcrumb-text">{item.label}</span>
                </button>
              ) : (
                <span className="breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              )}
              
              {index < breadcrumbItems.length - 1 && (
                <span className="breadcrumb-separator" aria-hidden="true">
                  <img 
                    src={arrow_icon} 
                    alt="" 
                    className="arrow-icon"
                    role="presentation"
                  />
                </span>
              )}
            </li>
          ))}
        </ol>
        
        {/* Decorative elements */}
        <div className="breadcrumb-glow"></div>
      </div>
    </nav>
  );
};

export default Breadcrumbs;