import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Team } from 'services/logic/constants';

const Wrapper = styled.div`
  align-items: center;
  color: ${props => (props.team === Team.RED ? 'red' : 'black')};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const Player = ({ name, team }) => (
  <Wrapper className="Player" team={team}>
    {`${team === Team.RED ? '帥' : '將'} ${name || ''}`}
  </Wrapper>
);

Player.propTypes = {
  name: PropTypes.string,
  team: PropTypes.string.isRequired,
};

Player.defaultProps = {
  name: undefined,
};

export default Player;
