import React, { useContext, useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';



const Cart = () => {
  const PORT = process.env.REACT_APP_PORT || 3000;

  const { cartItems, food_list, removeFromCart, getTotalCart, addToCart, clientId, setCartItems } = useContext(StoreContext);
  
  const navigatte = useNavigate()

  return (
    <div className='cart'>
      {clientId ? <>Your Client Id : {clientId}</> : <>Non connect</>}
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
          if(clientId > 0){
            console.log(`${item.name}  : ${quantity}`)
          }
          if (item && quantity > 0) {
            return (
              <div key={itemId} className='cart-items-title cart-items-item'>
                <img className='cart-items-image' src={item.image} alt="" />
                <p className='cart-items-name'>{item.name}</p>
                <p className='cart-items-price'>R${item.price}</p>
                <p className='cart-items-quantity'>{quantity}</p>
                <p className='cart-items-total'>R${item.price * quantity}</p>
                <p className='cart-items-remove' onClick={() => removeFromCart(itemId)}>x</p>
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

            <button onClick={() => navigatte('/pedido')}className='cart-total-details-button'>Concluir Pagamento</button>

          </div>
          <div className='cart-total-promotion'>
            <div className='cart-total-right'>

              <p className='cart-total-right-title'>Se vc tiver um código promocional,Adicione aqui !</p>
              <div className='cart-total-right-inputs'>
                <input placeholder='Código Promocional' className='cart-total-right-input' type="text" />
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