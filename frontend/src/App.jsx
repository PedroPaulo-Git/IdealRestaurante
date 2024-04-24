import React from 'react'
import Navbar from './components/Navbar/Navbar';
import { assets } from './assets/assets';

const App = () => {
  return (
    <div className='app'>
      {/* <h1>PIZZA</h1>
      <img className='BannerIdeal' src={assets.BannerIdeal} alt="" /> */}
      <Navbar/>
    </div>
  )
}
export default App