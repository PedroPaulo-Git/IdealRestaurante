import React from 'react';
import './ExploreMenu.css';
import { assets_menuList } from '../../assets/assets';

const ExploreMenu = ({category,setCategory}) => {
  return (
    <div className='explore-menu' id='explore-menu'>

        <h1 className='explore-menu-h1'>Explore nosso menu</h1>
        <p className='explore-menu-p'> Aqui você pode escolher entre uma variedade de pratos deliciosos. 
     Nossa equipe está pronta para atender o seu pedido e garantir que sua experiência seja memorável.
     Estamos ansiosos para servir a sua comida favorita!</p>
     <div className='explore-menu-list'>
        {assets_menuList.map((item,index)=>{
            return(
                <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index} className='explore-menu-list-item'>
                    <img className={category===item.menu_name?"active":""} src={item.menu_image} alt="" />
                    <p>{item.menu_name}</p>
                </div>
            )
        })}
     </div>
  
        <hr />
    </div>
  )
}
export default ExploreMenu;