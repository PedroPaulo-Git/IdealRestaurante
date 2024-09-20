import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';

export const LoginPopup = ({setShowLoginPopup}) => {

  const [currentState,setCurrentState]=useState('Login')
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    
    e.preventDefault(); // Prevent default form submission
    const PORT = process.env.REACT_APP_PORT || 3000;
    const url = currentState === 'Login' ? `http://localhost:${PORT}/api/login` : `http://localhost:${PORT}/api/register`; // Adjust API endpoints

    const payload = {
      ...(currentState === 'Registrar-se' && { username }), // Include username for registration
      email,
      password,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const text = await response.text(); // Get the raw response text
      console.log('Response:', text);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      if (response.ok) {
        // Handle successful login or registration
        console.log(data); // For demonstration purposes
        setShowLoginPopup(false); // Close popup on success

      } else {
        // Handle errors
        const data = JSON.parse(text); // Parse the response as JSON
        console.log(data);
        console.error(data.error);
      }
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
      console.log(data);
    }
    console.log('Requesting URL:', url);

  };

  return (
    <div className='login-popup'>
      <div className='login-popup-content'>
        <form onSubmit={handleSubmit}>

          <div className='login-popup-content-tittle'>
            <h2>{currentState}</h2>
            <img src={assets.Close} onClick={()=>setShowLoginPopup(false)} alt="" />
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
            {currentState ==='Registrar-se'?'Criar Conta':'Login'}
            </button>

          <div className='login-popup-content-condition'>
            <div className='login-popup-content-condition-terms'>
              <input type="checkbox" name="" id="" required/>
              <p>Para continuar,eu aceito os termos de uso & política de privacidade.</p>
            </div>
            <div className='login-popup-content-condition-login'>
              {currentState ==='Login'?
            <p>Não tem uma conta? <span onClick={() =>setCurrentState('Registrar-se')} > Clique aqui</span></p>:
               <p>Já tem uma conta? <span onClick={() =>setCurrentState('Login')} > Login aqui </span></p> }
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
export default LoginPopup;