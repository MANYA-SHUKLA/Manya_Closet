import React, { useContext, useState } from 'react'
import "../CSS/ShopCategory.css"
import { ShopContext } from '../Context/ShopContext'
import dropdown_icon from "../assets/dropdown_icon.png"
import Item from '../Components/Item/Item'

const ShopCategory = (props) => {
  const {all_product} = useContext(ShopContext);
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  // Enhanced filtering and sorting
  const filteredProducts = all_product
    .filter(item => props.category === item.category)
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch(sortBy) {
        case 'price_low': return a.new_price - b.new_price;
        case 'price_high': return b.new_price - a.new_price;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  React.useEffect(() => {
    setIsAnimated(true);
  }, []);

  return (
    <div className='shop-category'>
      {/* Enhanced Banner with Overlay */}
      <div className="banner-container">
        <img className='shopcategory-banner' src={props.banner} alt="" />
        
        {/* Animated Overlay Content */}
        <div className={`banner-overlay ${isAnimated ? 'animate-in' : ''}`}>
          <h1 className="banner-title">
            {props.category.charAt(0).toUpperCase() + props.category.slice(1)}'s Collection
          </h1>
          <p className="banner-subtitle">
            Discover Amazing Products ✨
          </p>
        </div>

        {/* Floating Elements */}
        <div className="floating-element">
          🔥
        </div>
      </div>

      {/* Enhanced Search Bar */}
      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
          >
            {showFilters ? '✖ Close' : '🎛️ Filters'}
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-options">
              <label className="filter-label">Quick Sort:</label>
              {['Featured', 'Price ↑', 'Price ↓', 'A-Z'].map((option, index) => {
                const values = ['featured', 'price_low', 'price_high', 'name'];
                return (
                  <button
                    key={option}
                    onClick={() => setSortBy(values[index])}
                    className={`sort-button ${sortBy === values[index] ? 'active' : ''}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Index Sort */}
      <div className='shopcategory-indexSort'>
        <p className="results-info">
          <span>Showing 1-{Math.min(12, filteredProducts.length)}</span> out of {filteredProducts.length} products
          {searchTerm && <span className="search-term">for "{searchTerm}"</span>}
        </p>
        
        <div className='shopcategory-sort enhanced-sort'>
          Sort by <img src={dropdown_icon} alt="" height="20px" className="dropdown-icon"/>
        </div>
      </div>

      {/* Enhanced Products Grid */}
      <div className="shopcategory-products">
        {filteredProducts.map((item, i) => {
          return (
            <div
              key={i}
              className={`product-wrapper ${isAnimated ? 'animate-product' : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="glow-effect"></div>
              <Item 
                key={i} 
                id={item.id} 
                name={item.name} 
                image={item.image} 
                new_price={item.new_price} 
                old_price={item.old_price}
              />
            </div>
          );
        })}

        {/* No Results Message */}
        {filteredProducts.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Enhanced Load More Button */}
      <div className="shopcategory-loadmore enhanced-loadmore">
        <span className="loadmore-text">
          ✨ Explore More ✨
        </span>
        <div className="shimmer-effect"></div>
      </div>
    </div>
  )
}

export default ShopCategory