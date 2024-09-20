import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { FaBasketShopping } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLoginPopup}) => {

  const [menu, setMenu] = useState('menu');
  const {getTotalCart} = useContext(StoreContext)

  return (
    <div className='navbar'>
      <Link to='/'><img className='Logo' src={assets.Logo} alt="" /></Link>

      <ul className='navbar-menu'>
        <Link to='/' onClick={() => { setMenu('home') }} className={`${menu === 'home' ? 'active' : ''}`}>home</Link>
        <a href='#explore-menu' onClick={() => { setMenu('menu') }} className={`${menu === 'menu' ? 'active' : ''}`}>menu</a>
        <a href='#app-download' onClick={() => { setMenu('mobile') }} className={`${menu === 'mobile' ? 'active' : ''}`}>mobile</a>
        <a href='#footer' onClick={() => { setMenu('contato') }} className={`${menu === 'contato' ? 'active' : ''}`}>contato</a>
      </ul>

      <div className='navbar-right'>
        <span style={{ fontSize: 26, marginTop: 2 }} className='navbar-right-search-icon'><FaSearch /></span>
        <div className='navbar-right-search'>
          <Link to='carrinho' style={{ fontSize: 28 }} className='navbar-right-basket'><FaBasketShopping /></Link>
          <div className={getTotalCart()===0?'':'dot'}></div>
        </div>
        <button onClick={() => setShowLoginPopup(true)} className='button-navbar'>Registrar</button>
      </div>

    </div>
  )
}
export default Navbar