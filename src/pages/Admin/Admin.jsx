import React from 'react'
import Navbar from './Navbar/Navbar';
import Navside from './Navside/Navside';
import Dashboard from './Dashboard/Dashboard';

const Admin = () => {
  return (
    <div className='admin h-[100vw]'>

      <Navside />
      <Navbar />
      <Dashboard />



      {/* DASHBOARD */}

    </div>
  )
}

export default Admin;