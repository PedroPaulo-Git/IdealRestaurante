import React, { useContext, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

export const FoodItem = ({id,name,price,description,image}) => {

    const [itemCount,setItemCount] = useState(0)
    const {cartItems,addToCart,removeFromCart}= useContext(StoreContext);

  return (
    <div className='food-item'>
        <div className="food-item-img-container">
            <img src={image} alt="" className="food-item-image" />
            {!cartItems[id]
                ? <img onClick={()=>addToCart(id)} src={assets.Plus} className='food-item-plusbutton'/>
                :
                <div className='food-item-counting'>
                    <img onClick={()=>removeFromCart(id)} src={assets.Less} className='food-item-lessbutton'/>
                    <p>{cartItems[id]}</p>
                    <img onClick={()=>addToCart(id)} src={assets.More} className='food-item-morebutton'/>
                </div>
            }
        </div>
        <div className="food-item-info">
            <div className="food-item-name-rating">
                <p>{name}</p>
                <img className='food-item-rating_star'src={assets.Rating_star} alt="" />
            </div>
            <p className="food-item-description">
                {description}
            </p>
            <p className="food-item-price">${price}</p>
        </div>
    </div>
  )
}
export default FoodItem;