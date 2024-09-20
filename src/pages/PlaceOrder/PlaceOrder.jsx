import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import { QrCodePix } from 'qrcode-pix';


const PlaceOrder = () => {
  const { getTotalCart } = useContext(StoreContext);
  const [qrCode, setQrCode] = useState(null);

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
          onClick={handleConcludePayment}
          className='cart-total-details-button'>Concluir Pagamento</button>

        {qrCode ? (
          <div className='qrcode-container'>
            <img src={qrCode} alt="QR Code Pix" />
          </div>
        ) : (
          <p>Generating QR code...</p>
        )}
        
      </div>
    </div>
  )
}
export default PlaceOrder;