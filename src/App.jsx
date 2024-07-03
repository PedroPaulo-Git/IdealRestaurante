import React from 'react'
import Navbar from './components/Navbar/Navbar';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup';

const App = () => {
  const [showLoginPopup,setShowLoginPopup] = useState(false);

  return (
    <>
    {showLoginPopup?<LoginPopup setShowLoginPopup={setShowLoginPopup}/>:<></>}
    <div className='app'>
      <Navbar setShowLoginPopup={setShowLoginPopup}/>
      <Routes>
        <Route path='/IdealRestaurante' element={<Home/>}/>        
        <Route path='/carrinho' element={<Cart/>}/>
        <Route path='/pedido' element={<PlaceOrder/>}/>
      </Routes>
    </div>
    <Footer/>
    </>
  )
}
export default App