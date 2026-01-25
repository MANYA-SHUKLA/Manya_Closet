import React, { useEffect, useRef, useContext } from 'react';
import "./Popular.css";
import Item from "../Item/Item";
import { ShopContext } from "/src/context/ShopContext";

const Popular = () => {
  const { all_product, loading } = useContext(ShopContext);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const itemsRef = useRef([]);

  // Get popular products (first 4 products, or featured products)
  const popularProducts = all_product.slice(0, 4);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe header
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    // Observe each item
    itemsRef.current.forEach((item) => {
      if (item) {
        observer.observe(item);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [popularProducts]);

  if (loading) {
    return (
      <section className='popular' ref={sectionRef}>
        <div className='popular-header'>
          <h1 className='popular-title'>Popular Products</h1>
          <p className='popular-subtitle'>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className='popular' ref={sectionRef}>
      <div className='popular-header scroll-fade' ref={headerRef}>
        <h1 className='popular-title'>Popular Products</h1>
        <p className='popular-subtitle'>Discover our most loved pieces</p>
        <div className='popular-divider'></div>
      </div>
      
      <div className='popular-grid'>
        {popularProducts.map((item, i) => (
          <div 
            key={item.id} 
            className='popular-item-wrapper scroll-item'
            ref={(el) => itemsRef.current[i] = el}
            style={{ '--delay': `${i * 0.1}s` }}
          >
            <Item 
              id={item.id} 
              name={item.name} 
              image={item.image} 
              new_price={item.new_price} 
              old_price={item.old_price}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Popular;
