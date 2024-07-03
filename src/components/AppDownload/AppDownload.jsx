import React from 'react';
import './AppDownload.css';
import { assets } from '../../assets/assets';


export const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
       
        <p>Para Uma Melhor Experiência Baixe</p>
        <p>Ideal Restaurante App</p>
        <div className='app-download-content'> 
            <img className='app-download-content-img' src={assets.AppDownloadIMG_Apple} alt="" />
            <img className='app-download-content-img' src={assets.AppDownloadIMG_Google} alt="" />
        </div>
    </div>
  )
}
export default AppDownload ;
