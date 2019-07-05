import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Wrapper = styled.div(
  ({ color }) => ({ color }),
);

const Player = ({ name, color }) => {
  const displayText = `${color === 'red' ? '帥' : '將'} ${name}`;

  return (
    <Wrapper color={color}>
      {displayText}
    </Wrapper>
  );
};

Player.propTypes = {
  color: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Player;
