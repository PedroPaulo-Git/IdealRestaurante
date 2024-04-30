import React from 'react'
import Navbar from './components/Navbar/Navbar';
import { assets } from './assets/assets';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer'

const App = () => {
  return (
    <>
    <div className='app'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/pedido' element={<PlaceOrder/>}/>
        <Route path='/carrinho' element={<Cart/>}/>
      </Routes>
    </div>
    <Footer/>
    </>
  )
}
export default App