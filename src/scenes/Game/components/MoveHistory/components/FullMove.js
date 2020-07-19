import React from 'react';
import styled from '@emotion/styled';

import PropTypes from 'prop-types';

const Wrapper = styled.div`
  flex: 0 0 auto;
  justify-self: center;
`;

const FullMove = ({ children, ordering }) => (
  <Wrapper className="FullMove">
    <span>{`${ordering}. `}</span>
    {children}
  </Wrapper>
);

FullMove.propTypes = {
  children: PropTypes.node.isRequired,
  ordering: PropTypes.number.isRequired,
};

export default FullMove;
