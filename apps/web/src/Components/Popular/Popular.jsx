import React, { useEffect, useRef } from 'react';
import "./Popular.css";
import Item from "../Item/Item";
import data_product from '../../assets/data';

const Popular = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const itemsRef = useRef([]);

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
  }, []);

  return (
    <section className='popular' ref={sectionRef}>
      <div className='popular-header scroll-fade' ref={headerRef}>
        <h1 className='popular-title'>Popular in Women</h1>
        <p className='popular-subtitle'>Discover our most loved pieces</p>
        <div className='popular-divider'></div>
      </div>
      
      <div className='popular-grid'>
        {data_product.map((item, i) => (
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