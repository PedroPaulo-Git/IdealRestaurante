import React, { useContext, useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';



const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCart  } = useContext(StoreContext);
  const navigatte = useNavigate()
  const { clientId } = useContext(StoreContext); 

  const handleAddToCart = (itemId) => {

   
    if (!clientId) {
      console.error('Client ID is not defined');
      return;
  }

    fetch('/carrinho', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            clientId:clientId,
            productId: itemId,
            quantity: quantity,
        }),
    })
    .then(response => response.json())
    .then(data => {
        addToCart(itemId);
    })
    .catch(error => console.error('Error:', error));
};


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
        {food_list.map((item, index) => {

          if (cartItems[item._id] > 0) {
            return (
              <>
                <div key={index} className='cart-items-title cart-items-item'>
                  <img className='cart-items-image' src={item.image} alt="" />
                  <p className='cart-items-name' >{item.name}</p>
                  <p className='cart-items-price' >R${item.price}</p>
                  <p className='cart-items-quantity' >{cartItems[item._id]}</p>
                  <p className='cart-items-total' >R${item.price * cartItems[item._id]}</p>
                  <p className='cart-items-remove' onClick={() => removeFromCart(item._id)}>x</p>
                </div>
                <hr />
              </>
            )
          }
          return null
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
 
            <button onClick={()=>navigatte('/pedido')} className='cart-total-details-button'>Informacoes</button>
         
            <button onClick={handleAddToCart} className='cart-total-details-button'>Concluir Pagamento</button>
            
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