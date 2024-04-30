import React, { useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { FaBasketShopping } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const Navbar = () => {

  const [menu,setMenu] = useState('menu')

  return (
    <div className='navbar'>

      <img className='Logo' src={assets.Logo} alt="" />

      <ul className='navbar-menu'>
        <li onClick={()=>{setMenu('home')}} className={`${menu === 'home' ? 'active':''}`}>home</li>
        <li onClick={()=>{setMenu('menu')}} className={`${menu === 'menu' ? 'active':''}`}>menu</li>
        <li onClick={()=>{setMenu('mobile')}} className={`${menu === 'mobile' ? 'active':''}`}>mobile</li>
        <li onClick={()=>{setMenu('contato')}} className={`${menu === 'contato' ? 'active':''}`}>contato</li>
      </ul>

      <div className='navbar-right'>
        <span style={{fontSize:26,marginTop:2}} className='navbar-right-search-icon'><FaSearch /></span>
        <div className='navbar-right-search'>
          <span style={{fontSize:28}} className='navbar-right-basket'><FaBasketShopping /></span>
          <div className='dot'></div>
        </div>
        <button className='button-navbar'>Registrar</button>
      </div>

    </div>
  )
}
export default Navbar