import React from 'react';
import styled from '@emotion/styled';
import Board from './Game/Board/Board';
import Player from './Game/Player/Player';

const Wrapper = styled.div`
  text-align: center;
`;

const App = () => (
  <Wrapper className="App">
    <Board
      redPlayer={<Player color="red" />}
      blackPlayer={<Player color="black" />}
    />
  </Wrapper>
);

export default App;
