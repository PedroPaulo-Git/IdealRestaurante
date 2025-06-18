import React,{useContext,useEffect} from 'react'
import Navbar from './Navbar/Navbar';
import Navside from './Navside/Navside';
import Dashboard from './Dashboard/Dashboard';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Admin = () => {
  const { clientId } = useContext(StoreContext); 
  const navigate = useNavigate();
  useEffect(() => {
 
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode(token); // Decodifique o token
      console.log('Decoded token:', decodedToken);

      if (!decodedToken.isAdmin) { // Verifique se isAdmin é false ou undefined
        navigate('/'); // Redireciona se não for admin
      }
    } else {
      console.log('Token não encontrado');
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className='admin h-[100%]'>

      <Navside />
      <Navbar />
      <Dashboard />



      {/* DASHBOARD */}

    </div>
  )
}

export default Admin;