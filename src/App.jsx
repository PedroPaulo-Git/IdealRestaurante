import React from 'react'
import Navbar from './components/Navbar/Navbar';
import { useState } from 'react';
import { Route, Routes,useLocation,Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup';
import StoreContextProvider from './context/StoreContext';
import Admin from './pages/Admin/Admin';
import AdminRoute from './pages/Admin/Router/adminRouter';
import { Buffer } from 'buffer';



const App = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const isAdmin = true;
  window.Buffer = Buffer;
  return (
    <>
      <StoreContextProvider setShowLoginPopup={setShowLoginPopup}>
        {showLoginPopup ? <LoginPopup setShowLoginPopup={setShowLoginPopup} /> : <></>}
        <div className={`${isAdminPage ? 'admin-page' : 'app'}`}>
        {location.pathname !== '/admin' && <Navbar setShowLoginPopup={setShowLoginPopup} />}
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/admin" element={isAdmin ? <Admin /> : <Navigate to="/" />} />
            <Route path='/carrinho' element={<Cart />} />
            <Route path='/pedido' element={<PlaceOrder />} />
          </Routes>
        </div>
        <Footer />
      </StoreContextProvider>
    </>
  )
}
export default App