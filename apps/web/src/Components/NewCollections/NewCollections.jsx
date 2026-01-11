import React from 'react'
import "./NewCollections.css"
import new_collections from '../../assets/newcollections'
import Item from '../Item/Item'

const NewCollections = () => {
    return (
        <section className='newcollections'>
            <div className="newcollections-container">
                {/* Header Section */}
                <div className="newcollections-header">
                    <div className="section-badge">
                        <span className="badge-text">Fresh Arrivals</span>
                    </div>
                    <h1 className="section-title">New Collections</h1>
                    <p className="section-description">
                        Discover our latest handpicked styles and trending fashion pieces
                    </p>
                    <div className="title-underline">
                        <div className="underline-dot"></div>
                        <div className="underline-line"></div>
                        <div className="underline-dot"></div>
                    </div>
                </div>

                {/* Collections Grid */}
                <div className='collections-grid'>
                    {new_collections.map((item, i) => {
                        return (
                            <div key={i} className="collection-item-wrapper">
                                <Item 
                                    id={item.id} 
                                    name={item.name} 
                                    image={item.image} 
                                    new_price={item.new_price} 
                                    old_price={item.old_price}
                                />
                            </div>
                        )
                    })}
                </div>

                {/* View More Section */}
                <div className="collections-footer">
                    <button className="view-more-btn">
                        <span>View All Collections</span>
                        <div className="btn-shine"></div>
                    </button>
                </div>
            </div>

            {/* Background Decorations */}
            <div className="collections-decorations">
                <div className="decoration-shape shape-1"></div>
                <div className="decoration-shape shape-2"></div>
                <div className="decoration-shape shape-3"></div>
            </div>
        </section>
    )
}

export default NewCollections