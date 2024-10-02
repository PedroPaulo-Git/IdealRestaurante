import React from 'react';
import './Footer.css'
import { assets } from '../../assets/assets';

import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa6";

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className='footer-content'>

                <div className='footer-content-left'>
                    <img src={assets.LogoFoooter2} alt="" />
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nobis cumque delectus nemo rem, at earum ea adipisci, praesentium ipsa iusto quibusdam repudiandae eius quasi pariatur accusamus nam enim similique sapiente?</p>
                    <div className='footer-content-left-social'>
                        <span> <a href=""><FaFacebookF /></a></span>
                        <span><a href=""><FaInstagram /></a></span>
                        <span><a href=""><FaLinkedinIn /></a></span>
                        <span><a href=""><FaWhatsapp /></a></span>
                    </div>
                </div>
                <div  className='footer-content-center' >
                    <div className='footer-content-center-left'>
                        <h2>COMPANIA</h2>
                        <ul>
                            <li>Home</li>
                            <li>Portifolio</li>
                            <li>Sobre Min</li>
                            <li>Delivery</li>
                            <li>Politica de privacidade</li>
                        </ul>
                    </div>
                    <div className='footer-content-center-right'>
                        <h2>ENTRE EM CONTATO</h2>
                        <p>+55 81 99904-9803</p>
                        <p>receberpedro 09@gmail.com</p>
                    </div>
                </div>
            </div>
            <hr />
            <p className='footer-copyright'>&copy; 2024 Ideal Restaurante . All rights reserved.</p>
        </div>
    )
}
export default Footer;
