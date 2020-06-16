import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

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
