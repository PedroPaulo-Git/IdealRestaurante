import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [clientId, setClientId] = useState(null);

  return (
    <UserContext.Provider value={{ clientId, setClientId }}>
      {children}
    </UserContext.Provider>
  );
};