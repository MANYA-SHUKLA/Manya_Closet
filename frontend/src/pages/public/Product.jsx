import React, { useContext } from 'react'
import { ShopContext } from '../../context/ShopContext';
import { useParams } from 'react-router-dom';
import Bredcrums from '../../components/Bredcrums/BredCrums';
import ProductDisplay from '../../components/ProductDisplay/ProductDisplay';
import Description from '../../components/Description/Description';
import RelatedProducts from '../../components/RelatedProducts/RelatedProducts';
const Product = () => {
  const {all_product} = useContext(ShopContext);
  const {productId} = useParams();
  const product = all_product.find((e)=> e.id === productId || e.id === productId.toString());
  
  if (!product) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Product not found</h1>
        <p>The product you're looking for doesn't exist.</p>
      </div>
    );
  }
  
  return (
    <div>
      <Bredcrums product={product}/>
      <ProductDisplay product={product}/>
      <Description/>
      <RelatedProducts currentProductId={product.id} category={product.category} />
    </div>
  )
}

export default Product