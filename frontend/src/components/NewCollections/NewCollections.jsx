import React, { useContext } from 'react'
import "./NewCollections.css"
import Item from "../Item/Item"
import { ShopContext } from "../context/ShopContext"'

const NewCollections = () => {
  const { all_product, loading } = useContext(ShopContext);

  // Get new collections (products 5-12, or a subset)
  const newCollections = all_product.slice(4, 12);

  if (loading) {
    return (
      <div className="newcollections">
        <h1>NEW COLLECTIONS</h1>
        <hr />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="newcollections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {newCollections.map((item, i) => {
          return (
            <Item 
              key={i} 
              id={item.id} 
              name={item.name} 
              image={item.image} 
              new_price={item.new_price} 
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  )
}

export default NewCollections
