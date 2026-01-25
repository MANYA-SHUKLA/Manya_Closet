import Layout from "./components/Layout/Layout"
import AdminLayout from "./components/Layout/AdminLayout"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Shop from "./pages/public/Shop"
import ShopCategory from "./pages/public/ShopCategory"
import Product from "./pages/public/Product"
import LoginSignup from "./pages/public/LoginSignup"
import Cart from "./pages/user/Cart"
import Wishlist from "./pages/user/Wishlist"
import Orders from "./pages/user/Orders"
import Profile from "./pages/user/Profile"
import Checkout from "./pages/user/Checkout"
import ProtectedRoute from "./components/ProtectedRoute"
import Dashboard from "./pages/admin/Dashboard"
import Products from "./pages/admin/Products"
import Inventory from "./pages/admin/Inventory"
import AdminOrders from "./pages/admin/Orders"
import Users from "./pages/admin/Users"
import Payments from "./pages/admin/Payments"
import Coupons from "./pages/admin/Coupons"
import AdminLogin from "./pages/admin/Login"
// Using online image URLs
const men_banner = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop&q=80"
const women_banner = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop&q=80"
const kids_banner = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=600&fit=crop&q=80"

function App() {
 
  return (
    <div>
      <BrowserRouter>
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><Shop/></Layout>}/>
            <Route path="/mens" element={<Layout><ShopCategory banner={men_banner} category="men"/></Layout>}/>
            <Route path="/womens" element={<Layout><ShopCategory banner={women_banner} category="women"/></Layout>}/>
            <Route path="/kids" element={<Layout><ShopCategory banner={kids_banner} category="kid"/></Layout>}/>
            <Route path="/product" element={<Layout><Product/></Layout>}/>
            <Route path="/product/:productId" element={<Layout><Product/></Layout>}/>
            <Route path="/login" element={<Layout><LoginSignup/></Layout>}/>
            
            {/* User Routes (Protected) */}
            <Route path="/cart" element={<Layout><ProtectedRoute><Cart/></ProtectedRoute></Layout>}/>
            <Route path="/checkout" element={<Layout><ProtectedRoute><Checkout/></ProtectedRoute></Layout>}/>
            <Route path="/wishlist" element={<Layout><ProtectedRoute><Wishlist/></ProtectedRoute></Layout>}/>
            <Route path="/orders" element={<Layout><ProtectedRoute><Orders/></ProtectedRoute></Layout>}/>
            <Route path="/profile" element={<Layout><ProtectedRoute><Profile/></ProtectedRoute></Layout>}/>
            
            {/* Admin Routes (Protected with AdminLayout) */}
            <Route path="/admin/login" element={<AdminLogin />}/>
            <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminLayout><Dashboard/></AdminLayout></ProtectedRoute>}/>
            <Route path="/admin/products" element={<ProtectedRoute requireAdmin><AdminLayout><Products/></AdminLayout></ProtectedRoute>}/>
            <Route path="/admin/inventory" element={<ProtectedRoute requireAdmin><AdminLayout><Inventory/></AdminLayout></ProtectedRoute>}/>
            <Route path="/admin/orders" element={<ProtectedRoute requireAdmin><AdminLayout><AdminOrders/></AdminLayout></ProtectedRoute>}/>
            <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminLayout><Users/></AdminLayout></ProtectedRoute>}/>
            <Route path="/admin/payments" element={<ProtectedRoute requireAdmin><AdminLayout><Payments/></AdminLayout></ProtectedRoute>}/>
            <Route path="/admin/coupons" element={<ProtectedRoute requireAdmin><AdminLayout><Coupons/></AdminLayout></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
