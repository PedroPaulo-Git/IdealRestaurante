import React, { useContext, useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { QrCodePix } from 'qrcode-pix';

interface IParameter {
  version: string;
  key: string;
  city: string;
  name: string;
  value?: number;
  transactionId?: string;
  message?: string;
  cep?: string;
  currency?: number; //default: 986 ('R$')
  countryCode?: string; //default: 'BR'
}

interface IResponse {
  payload: () => string; //payload for QrCode
  base64: (options?) => Promise<string>; //QrCode image base64
}


const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCart } = useContext<any>(StoreContext);
  const navigatte = useNavigate()
  const [qrCode, setQrCode] = React.useState<string | null>(null);


  const generateQrCode = async () => {
    const qrCodePix = QrCodePix({
      version: '01',
      key: 'test@mail.com.br', // Your PIX key
      name: 'Fulano de Tal',
      city: 'SAO PAULO',
      transactionId: 'YOUR_TRANSACTION_ID', // max 25 characters
      message: 'Pay me :)',
      cep: '99999999',
      value: getTotalCart(), // You can set this dynamically
    });

    const base64QrCode = await qrCodePix.base64();
    setQrCode(base64QrCode);
    console.log(qrCodePix.payload()); // '00020101021126510014BR.GOV.BCB.PIX...'
  };

  const handleConcludePayment = async () => {
    // Generate QR code when button is clicked
    await generateQrCode();

    // Redirect or perform additional actions like payment processing here
    // navigatte('/pedido');
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
        {food_list.map((item: any, index: any) => {

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

            <button onClick={handleConcludePayment} className='cart-total-details-button'>Concluir Pagamento</button>

          </div>
          <div className='cart-total-promotion'>
            <div className='cart-total-right'>

              <p className='cart-total-right-title'>Se vc tiver um código promocional,Adicione aqui !</p>
              <div className='cart-total-right-inputs'>
                <input placeholder='Código Promocional' className='cart-total-right-input' type="text" />
                <button className='cart-total-right-button'>Aplicar</button>
              </div>

            </div>
            {/* Display the QR Code if it has been generated */}
            {qrCode ? (
              <div className='qrcode-container'>
                <img src={qrCode} alt="QR Code Pix" />
              </div>
            ) : (
              <p>Generating QR code...</p>
            )}
          </div>

        </div>
      </div>

    </div>
  )
}
export default Cart;