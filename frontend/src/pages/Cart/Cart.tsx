import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';



const Cart = () => {

  const {cartItems,food_list,removeFromCart} = useContext<any>(StoreContext);

  return (
    <div className='cart'>
      <div className='cart-items'>
        <div className='cart-items-title'>
          <p>Items</p>
          <p>Título</p>
          <p>Preço</p>
          <p>Quantidade</p>
          <p>Total</p>
          <p>Remover</p>
        </div>
        <br />
        <hr />
        {food_list.map((item:any,index:any) => {

          if (cartItems[item._id] > 0) 
            {
            return (
              <>
              <div key={index} className='cart-items-title cart-items-item'>
                <img className='cart-items-image' src={item.image} alt="" />
                <p className='cart-items-name' >{item.name}</p>
                <p className='cart-items-price' >R${item.price}</p>
                <p className='cart-items-quantity' >{cartItems[item._id]}</p>
                <p className='cart-items-total' >{item.price*cartItems[item._id]}</p>
                <p className='cart-items-remove'  onClick={()=>removeFromCart(item._id)}>x</p>
               
              </div> 
              <hr />
              </>
               )
          }
        })}



      </div>
    
    </div>
  )
}
export default Cart;