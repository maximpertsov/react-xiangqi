import React, { createContext } from 'react';
import PropTypes from 'prop-types';

export const SquareContext = createContext(null);

export const SquareProvider = ({ children, move, square }) => (
  <SquareContext.Provider value={{ move, square }}>
    {children}
  </SquareContext.Provider>
);

SquareProvider.propTypes = {
  children: PropTypes.node.isRequired,
  move: PropTypes.shape(),
  square: PropTypes.string.isRequired,
};

SquareProvider.defaultProps = {
  move: {},
};

export default {};
