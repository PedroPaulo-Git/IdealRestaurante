import React from 'react'
import './Header.css';

const Header = () => {
  return (
    <div className='header'>
      <div className='header-contents'>
        <h2 className='header-contents-h2'>Peça sua comida favorita aqui !</h2>
        <p className='header-contents-p'>
          Aqui você pode escolher entre uma variedade de pratos deliciosos.
          Nossa equipe está pronta para atender o seu pedido e garantir que sua experiência seja memorável.
          Estamos ansiosos para servir a sua comida favorita!
        </p>
        <a href="#explore-menu"><button className='button-header-contents'>Ver Menu</button></a>
      </div>
    </div>
  )
}
export default Header;