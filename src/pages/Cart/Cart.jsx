import React, { useContext, useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { FaTrashCan } from "react-icons/fa6";

const Cart = ({ id,fetchStripeConfig }) => {
  const PORT = process.env.REACT_APP_PORT || 3000;
  const { cartItems, food_list, removeFromCart, getTotalCart, clientId, addToCart, ReduceItem } = useContext(StoreContext);

  const navigatte = useNavigate()

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
        {Object.keys(cartItems).map((itemId) => {

          const quantity = cartItems[itemId];

          const item = food_list.find(product => product._id === itemId);
          if (clientId > 0) {
            if (item && quantity > 0) {
              console.log(`${item.name} : ${quantity}`)
            }

          }
          if (item && quantity > 0) {
            return (
              <div key={itemId} className='cart-items-title cart-items-item'>
                <img className='cart-items-image' src={item.image} alt="" />
                <p className='cart-items-name'>{item.name}</p>
                <p className='cart-items-price'>R${item.price}</p>


                <div className='cart-items-quantity-container'>
                  <img onClick={() => addToCart(itemId)} src={assets.More} className='food-item-morebutton' />
                  <p className='cart-items-quantity'>{quantity}</p>
                  <img onClick={() => ReduceItem(itemId)} src={assets.Less} className='food-item-lessbutton' />
                </div>

                <p className='cart-items-total'>R${item.price * quantity}</p>
                <p className='cart-items-remove' onClick={() => removeFromCart(itemId)}><FaTrashCan /></p>
              </div>
            );
          }
          return null;
        })}

        <div className='cart-total'>

          <div className='cart-total-left'>

            <h1>Total do Carrinho</h1>

            <div className='cart-total-details'>
              <p>Subtotal</p>
              R${getTotalCart()}
            </div>
            <div className='cart-total-details'>
              <p>Taxa de Entrega</p>
              R${0}
            </div>
            <div className='cart-total-details-total'>
              <p>Total</p>
              R${getTotalCart()}
            </div>

            {/* <button onClick={() => navigatte('/pedido')} className='cart-total-details-button'>Informacoes</button> */}

            <button onClick={() => navigatte('/pedido')} className='cart-total-details-button'>Concluir Pagamento</button>

          </div>
          <div className='cart-total-promotion'>
            <div className='cart-total-right'>

              <p className='cart-total-right-title '>Se vc tiver um código promocional,Adicione aqui !</p>
              <div className='cart-total-right-inputs'>
                <input placeholder='Código Promocional' className='cart-total-right-input text-sm' type="text" />
                <button className='cart-total-right-button'>Aplicar</button>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  )
}
export default Cart;