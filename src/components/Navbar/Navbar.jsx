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
  const { getTotalCart, clientId } = useContext(StoreContext)

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
          <span onClick={() => setUserShowInfo(!showUserInfo)} style={{ fontSize: 24, marginTop: 4 }}
            className='navbar-right-profile-icon'>
            <FaCircleUser />
            {showUserInfo && (
              <div className='navbar-right-info-profile'>
                  <ul >
                    <li className="navbar-right-ul-profile">
                      <ul class="space-y-1">
                        <li>
                          <a
                            href="#"
                            class="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
                          >
                            Profile
                          </a>
                        </li>

                        <li>
                          <a
                            href="#"
                            class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          >
                            Team
                          </a>
                        </li>

                        <li>
                          <a
                            href="#"
                            class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          >
                            Projects
                          </a>
                        </li>

                        <li>
                          <a
                            href="#"
                            class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          >
                            Meetings
                          </a>
                        </li>

                        <li>
                          <a
                            href="#"
                            class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          >
                            Calendar
                          </a>
                        </li>
                      </ul>
                    </li>

                    <li class="py-2">
                      <ul class="space-y-1">
                        <li>
                          <a
                            href="#"
                            class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          >
                            Update
                          </a>
                        </li>

                        <li>
                          <a
                            href="#"
                            class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          >
                            Help
                          </a>
                        </li>

                        <li>
                          <a
                            href="#"
                            class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          >
                            Settings
                          </a>
                        </li>
                      </ul>
                    </li>

                    <li class="py-2">
                      <form action="#">
                        <button
                          type="submit"
                          class="block w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 [text-align:_inherit] hover:bg-gray-100 hover:text-gray-700"
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