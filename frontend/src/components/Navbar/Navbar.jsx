import React from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { FaBasketShopping } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className='navbar'>

      <img className='Logo' src={assets.Logo} alt="" />

      <ul className='navbar-menu'>
        <li>home</li>
        <li>menu</li>
        <li>mobile</li>
        <li>contato</li>
      </ul>

      <div className='navbar-right'>
        <span><FaBasketShopping /></span>
        <div className='navbar-right-search'>
          <span><FaSearch /></span>
          <div className='dot'></div>
        </div>
        <button>Registrar</button>
      </div>

    </div>
  )
}
export default Navbar