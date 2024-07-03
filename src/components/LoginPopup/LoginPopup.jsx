import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';

export const LoginPopup = ({setShowLoginPopup}) => {

  const [CurrentState,setCurrentState]=useState('Login')


  return (
    <div className='login-popup'>
      <div className='login-popup-content'>
        <form action="">

          <div className='login-popup-content-tittle'>
            <h2>{CurrentState}</h2>
            <img src={assets.Close} onClick={()=>setShowLoginPopup(false)} alt="" />
          </div>

          <div className='login-popup-content-inputs'>
            {CurrentState ==='Login'? <></>:<input type="text" placeholder='Seu Usuário' required />}
            <input type="email" placeholder='Seu Email' required />
            <input type="password" placeholder='Sua Senha' required />
          </div>

          <button className='login-popup-content-button' type="submit">{CurrentState ==='Registrar-se'?'Criar Conta':'Login'}</button>

          <div className='login-popup-content-condition'>
            <div className='login-popup-content-condition-terms'>
              <input type="checkbox" name="" id="" required/>
              <p>Para continuar,eu aceito os termos de uso & política de privacidade.</p>
            </div>
            <div className='login-popup-content-condition-login'>
              {CurrentState ==='Login'?
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