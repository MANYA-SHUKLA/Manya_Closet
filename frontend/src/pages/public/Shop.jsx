import React from 'react'
import Hero from '../../components/Hero/Hero'
import Popular from '../../components/Popular/Popular'
import Offers from '../../components/Offers/Offers'
import NewCollections from "../../components/NewCollections/NewCollections"
import Newsletter from '../../components/NewsLetter/Newsletter'
import Footer from '../../components/Footer/Footer'


const Shop = () => {
  return (
    <div>
      <Hero/>
      <Popular/>
      <Offers/>
      <NewCollections/>
      <Newsletter/>
      
    </div>
  )
}

export default Shop