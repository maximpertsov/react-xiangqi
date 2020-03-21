import React, { Children } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: repeat(
    ${props => Children.count(props.children)},
    1fr
  );
  text-align: center;
`;

const GameMenu = ({ children }) => (
  <Wrapper className="GameMenu">{children}</Wrapper>
);

GameMenu.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GameMenu;
