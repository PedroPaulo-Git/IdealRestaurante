import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { FaBasketShopping } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";


import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLoginPopup }) => {

  const [menu, setMenu] = useState('menu');
  const [showUserInfo, setUserShowInfo] = useState(false);
  const { getTotalCart, clientId,clientName,logout } = useContext(StoreContext)

  return (
    <div className='navbar'>
      <Link to='/'><img className='Logo' src={assets.Logo} alt="" /></Link>

      <ul className='navbar-menu'>
        <Link to='/' onClick={() => { setMenu('home') }} className={`${menu === 'home' ? 'active' : ''}`}>home</Link>
        <a href='#explore-menu' onClick={() => { setMenu('menu') }} className={`${menu === 'menu' ? 'active' : ''}`}>menu</a>
        <a href='#app-download' onClick={() => { setMenu('mobile') }} className={`${menu === 'mobile' ? 'active' : ''}`}>mobile</a>
        <a href='#footer' onClick={() => { setMenu('contato') }} className={`${menu === 'contato' ? 'active' : ''}`}>contato</a>
      </ul>

      <div className='navbar-right' >
        <span style={{ fontSize: 22, marginTop: 2 }} className='navbar-right-search-icon'><FaSearch /></span>
        <div className='navbar-right-search'>
          <Link to='carrinho' style={{ fontSize: 22 }} className='navbar-right-basket'><FaBasketShopping /></Link>
          <div className={getTotalCart() === 0 ? '' : 'dot'}></div>
        </div>
        {clientId ?
          <span  onMouseLeave={() => setUserShowInfo(false)} 
          onMouseEnter={() => setUserShowInfo(true)} style={{ fontSize: 24, marginTop: 4 }}
            className='navbar-right-profile-icon'>
            <FaCircleUser/>
            {showUserInfo && (
              <div className='navbar-right-info-profile'>
                  <ul >
                  <li className="navbar-right-info-profile-user">
                     <p>Seja Bem-Vindo(a) {clientName} ! </p>
                    </li>
                    <li className="navbar-right-ul-profile">
                      <ul className="space-y-1">
                        <li>
                          <a
                            href="#"
                            className=""
                          >
                            Meu Perfil
                          </a>
                        </li>

                        <li>
                          <a
                            href="#"
                            className=""
                          >
                            Meus Pedidos
                          </a>
                        </li>

                   
                        <li>
                          <a
                            href="#"
                            className=""
                          >
                            Meus Endereços
                          </a>
                        </li>
                      </ul>
                    </li>

                    <li className="navbar-right-ul-profile">
                      <ul className="e-y-1">
                        <li>
                          <a
                            href="#"
                            className=""
                          >
                            Cupons
                          </a>
                        </li>

                        <li>
                          <a
                            href="#"
                            className=""
                          >
                            Ajuda
                          </a>
                        </li>

                      </ul>
                    </li>

                    <li className="">
                      <form action="#">
                        <button
                        onClick={logout}
                          type="submit"
                          className="button-logout"
                        >
                          Logout
                        </button>
                      </form>
                    </li>
                  </ul>
              </div>
            )}

          </span>
          :
          <button onClick={() => setShowLoginPopup(true)} className='button-navbar'>Login</button>
        }
      </div>

    </div>
  )
}
export default Navbar