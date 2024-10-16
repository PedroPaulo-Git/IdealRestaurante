import React,{useContext} from 'react'
import Navbar from './Navbar/Navbar';
import Navside from './Navside/Navside';
import Dashboard from './Dashboard/Dashboard';
import * as jwt_decode from "jwt-decode";
import { StoreContext } from '../../context/StoreContext';

const Admin = () => {
  const { clientId } = useContext(StoreContext); 

  useEffect(() => {
 
    const token = JSON.parse(localStorage.getItem('token'));

    if (token) {
  
      const decodedToken = jwt_decode(token);
      console.log(token)
      console.log('decodificated token ',decodedToken)
      if (decodedToken.role !== 'admin') {
        navigate('/');
      }
    } else {
      console.log('non find token',token)
      navigate('/login');
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