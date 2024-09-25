import React, { useContext, useState, useEffect } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(null);

  const { getTotalCart, clientId } = useContext(StoreContext);
  const [qrCode, setQrCode] = useState(null);
  const PORT = process.env.REACT_APP_PORT || 3000;
  const url = `http://localhost:${PORT}/api/address/${clientId}`


  const sucessfullMessage = () => {
    setIsEditing(false)
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(null);
    }, 2000);
  }
  useEffect(() => {
    //console.log(isEditing)
    //console.log(url)
    if (!url || url.includes('null')) {
      //console.error('URL is null or invalid');
      return;
    }
    const fetchAddress = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setPhone(data.phone);
          setAddress(data.address);
          setCity(data.city);
          setZipcode(data.zipcode);
        } else {
          console.error('Failed to fetch address');
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };
    fetchAddress();
  }, [url]);

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
        sucessfullMessage();
      } else {
        console.log('Error connection')
      }


    } catch (error) {
      console.log('Error connection CATCH', error)
    }
  }



  const generateTransactionId = () => {
    return `TRANS_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

const transactionId = generateTransactionId();


  const  generateQrCode = async () => {
    
    const response = await fetch(`http://localhost:${PORT}/api/${clientId}/generate-qr`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pixKey: 'pedroeneww@gmail.com', // Your PIX key
          name: 'Pedro Paulo da Silva Monteiro',
          city: 'Vertentes',
          transactionId: transactionId,
          message: 'Pay me :)',
          cep: '55770000',
          amount: 0.1, // Value set to R$0.10
      }),
    });
  

    if (!response.ok) {
      throw new Error('Failed to generate QR code');
    }
    const data = await response.json();
    console.log('QR Code generated:', data);
    if (response.ok) {
        setQrCode(data.qrCode); // Set the QR code in the state
        console.log(data.payload); // Log the QR code payload
    } else {
        console.error('Error generating QR code:', data.error);
    }
  };

  return (

    <div className='delivery-form'>
      {showSuccessMessage && (
        <div className="addressEdited-success">
          Endereço alterado com sucesso !
        </div>
      )}

      <div className='delivery-left-form-inputs'>
        <div className='delivery-left'>
          <div className='delivery-left-form'>


            {isEditing ? (

              <form onSubmit={addressForm} className='form'>
                <div className='delivery-left-form-inputs'>
                  <div className='delivery-left'>
                    <h1>Editar Informações de Entrega</h1>
                    <div className='delivery-left-form'>
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

                      <input
                        type="text"
                        placeholder='CEP'
                        pattern="^\d{5}-\d{3}$"
                        inputMode="numeric"
                        maxLength="9"
                        value={zipcode}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                          if (value.length > 5) {
                            value = value.replace(/^(\d{5})(\d{1,3})/, '$1-$2'); // Format as XXXXX-XXX
                          }
                          setZipcode(value);
                        }}
                      />
                    </div>

                    <input type='tel' placeholder='Telefone'
                      pattern="^\(\d{2}\) \d{5}-\d{4}$" inputMode="numeric"
                      maxLength="15"
                      required
                      value={phone}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 10) {
                          value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                        } else if (value.length > 6) {
                          value = value.replace(/^(\d{2})(\d{4,5})/, '($1) $2');
                        } else if (value.length > 2) {
                          value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
                        } else if (value.length > 0) {
                          value = value.replace(/^(\d{0,2})/, '($1');
                        }
                        setPhone(value);
                      }} />

                  </div>
                </div>
                <div className='delivery-buttons-form'>
                  <button type='submit' className='cart-total-details-button' >Editar</button>
                  <button type='button' className='cart-total-details-button' onClick={() => setIsEditing(false)}>Cancelar</button>
                </div>
              </form>

            ) : (

              <div className='form'>
                <div className='delivery-left-form-inputs'>
                  <div className='delivery-left'>
                    <h1>Informações de Entrega</h1>
                    <div className='delivery-left-form'>
                      <input value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        type="text" placeholder='Nome' readOnly />

                      <input type="text" placeholder='Sobrenome'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)} readOnly />
                    </div>

                    <input type="text" placeholder='Rua'
                      value={address}
                      onChange={(e) => setAddress(e.target.value)} readOnly />

                    <div className='delivery-left-form-inputs'>
                      <input type="text" placeholder='Cidade'
                        value={city}
                        onChange={(e) => setCity(e.target.value)} readOnly />

                      <input type="text" placeholder='CEP'
                        readOnly
                        pattern="[0-9]*" inputMode="numeric"
                        maxLength="9"
                        value={zipcode}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, ''); // Remove any non-numeric characters
                          if (value.length > 5) {
                            value = value.replace(/^(\d{5})(\d{1,3})/, '$1-$2'); // Add the dash after the first 5 digits
                          }
                          setZipcode(value)
                        }}
                      />

                    </div>
                    <input type='tel' placeholder='Telefone'
                      pattern="[0-9]*" inputMode="numeric"
                      maxLength="15"
                      required
                      readOnly
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
                <button className='cart-total-details-button' onClick={() => setIsEditing(true)}>Editar Endereço</button>
              </div>

            )}


          </div>
          <div className='delivery-left-form-inputs'>


          </div>


        </div>
      </div>

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
          onClick={generateQrCode}
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