import React, { useContext } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';

const PlaceOrder = () => {
  const {getTotalCart } = useContext(StoreContext);

  return (

    <div className='delivery-form'>
      <form action="" className='form'>
        <div className='delivery-left'>
          <h1>Informações de Entrega</h1>
          <div className='delivery-left-form'>

            <div className='delivery-left-form-inputs'>
              <input type="text" placeholder='Nome' />
              <input type="text" placeholder='Sobrenome' />
            </div>

            <input type="text" placeholder='Endereço de Email' />
            <input type="text" placeholder='Rua' />

            <div className='delivery-left-form-inputs'>
              <input type="text" placeholder='Cidade' />
              <input type="text" placeholder='Estado' />
            </div>
            <div className='delivery-left-form-inputs'>
              <input type="text" placeholder='CEP' />
              <input type="text" placeholder='País' />
            </div>
            <input type='tel' placeholder='Telefone' />

          </div>
        </div>
      </form>
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

        <button 
        onClick={() => navigatte('/pedido')} 
        className='cart-total-details-button'>Concluir Pagamento</button>

      </div>
    </div>
  )
}
export default PlaceOrder;