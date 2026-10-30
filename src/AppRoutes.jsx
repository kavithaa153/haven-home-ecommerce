import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import Orders from './pages/Orders.jsx'
import Admin from './pages/Admin.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/products" element={<Products />} />

      <Route path="/products/:id" element={<ProductDetails />} />

      <Route path="/cart" element={<Cart />} />

      <Route path="/wishlist" element={<Wishlist />} />

      <Route path="/checkout" element={<Checkout />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/orders" element={<Orders />} />

      <Route path="/admin" element={<Admin />} />

      <Route path="*" element={<Navigate to="/" replace />} />

      <Route path="/order-success" element={<OrderSuccess />} />
    </Routes>
  )
}