import React, { useContext, useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';



const Cart = () => {
  const PORT = process.env.REACT_APP_PORT || 3000;

  const { cartItems, food_list, removeFromCart, getTotalCart } = useContext(StoreContext);
  const navigatte = useNavigate()

  const { clientId } = useContext(StoreContext);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (clientId) {
        try {
          const response = await fetch(`http://localhost:${PORT}/api/carrinho/${clientId}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setCartItems(data.items || []); // Adjust according to the response structure
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      }
    };
    fetchCartItems();
  }, [clientId, PORT]);


  const getItemById = (itemId) => {
    return food_list.find(item => item._id === itemId);
  };

  const handleAddToCart = async (itemId) => {

    const item = getItemById(itemId);
    const quantity = cartItems[itemId] || 0;

    const updatedItem = { ...item, quantity: quantity + 1 };

    const payload = {
      clientId,
      productId: itemId, // Make sure this matches the type expected by your backend
      quantity: quantity + 1, // Increase the quantity by 1
    };
    console.log(item, quantity)
    if (!itemId || !item) {
      console.error("No item to add.");
      return;
    }

    if (!clientId) {
      console.error('Client ID is not defined');
      return;
    }


    console.log(clientId)
    try {

      const response = await fetch(`http://localhost:${PORT}/api/carrinho/${clientId}`, {
        method: 'POST', // Use POST to add items to the cart
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),

      });

      console.log('Adding item to cart:', { clientId, productId: itemId, quantity });

      console.log('Response status:', response.status); // Log the response status
      console.log('Response:', response);
      if (!response.ok) {
        const errorMessage = await response.text(); // Get the error message
        console.error('Error fetching cart:', errorMessage);

        throw new Error('Network response was not ok');

      }
      const cartData = await response.json();
      console.log(cartData);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }



  };


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
          if(clientId > 0){
            console.log('client exist')
          }
          const quantity = cartItems[itemId];
          const item = food_list.find(product => product._id === itemId);
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

            <button onClick={() => navigatte('/pedido')} className='cart-total-details-button'>Informacoes</button>

            <button onClick={() => handleAddToCart(item._id)} className='cart-total-details-button'>Concluir Pagamento</button>

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