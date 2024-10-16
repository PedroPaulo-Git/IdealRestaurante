import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const AdminRoute = ({ element, isAdmin, ...rest }) => (
  <Route
    {...rest}
    element={isAdmin ? element : <Navigate to="/" />}
  />
);

export default AdminRoute;
