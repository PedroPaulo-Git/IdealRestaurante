import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import { QrCodePix } from 'qrcode-pix';


const PlaceOrder = () => {


  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipcode, setZipcode] = useState('');


  const { getTotalCart, clientId } = useContext(StoreContext);
  const [qrCode, setQrCode] = useState(null);
  const PORT = process.env.REACT_APP_PORT || 3000;
  const url = `http://localhost:${PORT}/api/address/${clientId}`




  const addressForm = async (e) => {
    e.preventDefault();
    console.log(url)

    const getInfoClient = {
      firstName,
      lastName,
      phone,
      address,
      city,
      zipcode,
    }
    console.log(getInfoClient)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(getInfoClient),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data)
      } else {
        console.log('Error connection')
      }


    } catch (error) {
      console.log('Error connection CATCH', error)
    }
  }

  const SaveInfoClient = async (getInfoClient) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(getInfoClient),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data)
      } else {
        console.log('Error connection')
      }


    } catch (error) {
      console.log('Error connection CATCH', error)
    }
  }

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
      <form onSubmit={addressForm} className='form'>
        <div className='delivery-left'>
          <h1>Informações de Entrega</h1>
          <div className='delivery-left-form'>

            <div className='delivery-left-form-inputs'>

              <input value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text" placeholder='Nome' />

              <input type="text" placeholder='Sobrenome'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)} />
            </div>

            <input type="text" placeholder='Rua'
              value={address}
              onChange={(e) => setAddress(e.target.value)} />

            <div className='delivery-left-form-inputs'>
              <input type="text" placeholder='Cidade'
                value={city}
                onChange={(e) => setCity(e.target.value)} />

              <input type="text" placeholder='CEP'
                pattern="[0-9]*" inputmode="numeric" 
                maxlength="9" 
                value={zipcode}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, ''); // Remove any non-numeric characters
                  if (value.length > 5) {
                    value = value.replace(/^(\d{5})(\d{1,3})/, '$1-$2'); // Add the dash after the first 5 digits
                  }
                  setZipcode(value)}}
                  />

            </div>
            <div className='delivery-left-form-inputs'>


            </div>
            <input type='tel' placeholder='Telefone'
            pattern="[0-9]*" inputmode="numeric" 
            maxlength="15" 
            required
              value={phone}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, ''); // Remove any non-numeric characters
                if (value.length > 10) {
                  value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'); // Format as (XX) XXXXX-XXXX
                } else if (value.length > 6) {
                  value = value.replace(/^(\d{2})(\d{4,5})/, '($1) $2'); // Format as (XX) XXXX or (XX) XXXXX
                } else if (value.length > 2) {
                  value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2'); // Format as (XX) XXX
                } else if (value.length > 0) {
                  value = value.replace(/^(\d{0,2})/, '($1'); // Format as (XX
                }
                setPhone(value);
              }} />

          </div>
        </div>
        <button type='submit' onClick={SaveInfoClient}>teste</button>
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