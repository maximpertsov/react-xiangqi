import React, { createContext } from 'react';

export const SizeContext = createContext(null);

/* eslint-disable react/prop-types */
const SizeProvider = ({ size, children }) => (
  <SizeContext.Provider value={size}>{children}</SizeContext.Provider>
);

export default SizeProvider;
