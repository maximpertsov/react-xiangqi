import React from 'react';
import styled from '@emotion/styled';
import Board from './Board/Board';
import Player from './Player/Player';

const Wrapper = styled.div`
  text-align: center;
`;

const Game = () => (
  <Wrapper className="Game">
    <Board
      redPlayer={<Player color="red" />}
      blackPlayer={<Player color="black" />}
    />
  </Wrapper>
);

export default Game;
