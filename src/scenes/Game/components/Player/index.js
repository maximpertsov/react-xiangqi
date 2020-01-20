import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Color } from 'services/logic/constants';

const Wrapper = styled.div`
align-items: center;
color: ${props => props.color === Color.RED ? 'red' : 'black' };
display: flex;
flex-direction: column;
justify-content: space-around;
`;

const Player = ({ name, color }) => (
  <Wrapper className="Player" color={color}>
    {`${color === Color.RED ? '帥' : '將'} ${name || ''}`}
  </Wrapper>
);

Player.propTypes = {
  color: PropTypes.string.isRequired,
  name: PropTypes.string,
};

Player.defaultProps = {
  name: undefined,
};

export default Player;
