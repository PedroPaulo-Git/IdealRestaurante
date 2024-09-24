import React, { useState, useContext,useEffect } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

export const LoginPopup = ({ setShowLoginPopup }) => {

  const [currentState, setCurrentState] = useState('Login')
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(null);

  const { login,fetchCartItems} = useContext(StoreContext);
  const PORT = process.env.REACT_APP_PORT || 3000;
  const url = currentState === 'Login' ? `http://localhost:${PORT}/api/login` : `http://localhost:${PORT}/api/register`; // Adjust API endpoints
  
  useState(()=>{
    console.log(url)
    console.log(username)
  })
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...(currentState === 'Registrar-se' && { username }), // Include username for registration
      email,
      password,
    };
    console.log('payload > ',payload)
    console.log('current > ',currentState)
   
    if (currentState === 'Login') {
      await handleLogin({ username, email, password }); // Assuming you want to send these for login
  } else {
      await handleRegister(payload);
  }

  };


  const handleRegister = async (payload) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();

        if (!response.ok) {
            console.error('RESPONSE NOT WORK', data);
            setShowSuccessMessage(false);
            setTimeout(() => {
                setShowSuccessMessage(null);
            }, 3000);
        } else {
            console.log('RESPONSE WORK', data);
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(null);
                setShowLoginPopup(false);
            }, 3000);
        }
    } catch (error) {
        console.error('Error during registration request', error);
    }
};

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (response.ok && data.client) {
        login(data.client.id,data.client.username); // Call the login method from context
        fetchCartItems(data.client.id); 
        console.log('RESPONSE WORK', data);
        setShowSuccessMessage(true);
        setTimeout(() => {
            setShowSuccessMessage(null);
            setShowLoginPopup(false);
        }, 3000);
      } else {
        console.error('Login failed:', data.message || 'Unknown error');
        console.error('RESPONSE NOT WORK', data);
        setShowSuccessMessage(false);
        setTimeout(() => {
            setShowSuccessMessage(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error during login request', error);
    }
  };






  return (
    <div className='login-popup'>
      {showSuccessMessage && (
        <div className="loginorregister-success">
      {currentState === 'Login' ? <>Login</>: <>Registro</>  } feito com sucesso!
        </div>
      )}
      {showSuccessMessage === false && (
        <div className="loginorregister-fail">
           {currentState === 'Login' ? <>Login</>: <>Registro</>  } mal sucedido! Tente Novamente
        </div>
      )}
      <div className='login-popup-content'>
        <form onSubmit={handleSubmit}>

          <div className='login-popup-content-tittle'>
            <h2>{currentState}</h2>
            <img src={assets.Close} onClick={() => setShowLoginPopup(false)} alt="" />
          </div>

          <div className='login-popup-content-inputs'>
            {currentState === 'Registrar-se' &&
              (
                <input type="text"
                  placeholder='Seu Usuário'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required />
              )
            }
            <input type="email" placeholder='Seu Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />

            <input type="password" placeholder='Sua Senha'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />

          </div>

          <button className='login-popup-content-button' type="submit">
            {currentState === 'Registrar-se' ? 'Criar Conta' : 'Login'}
          </button>

          <div className='login-popup-content-condition'>
            <div className='login-popup-content-condition-terms'>
              <input type="checkbox" name="" id="" required defaultChecked/>
              <p>Para continuar,eu aceito os termos de uso & política de privacidade.</p>
            </div>
            <div className='login-popup-content-condition-login'>
              {currentState === 'Login' ?
                <p>Não tem uma conta? <span onClick={() => setCurrentState('Registrar-se')} > Clique aqui</span></p> :
                <p>Já tem uma conta? <span onClick={() => setCurrentState('Login')} > Login aqui </span></p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
export default LoginPopup;