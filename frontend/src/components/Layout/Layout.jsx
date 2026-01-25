import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import FloatingShapes from '../FloatingShapes/FloatingShapes';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <FloatingShapes />
      <Navbar />
      <main className="layout-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

