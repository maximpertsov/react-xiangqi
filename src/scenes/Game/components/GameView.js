import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import { getMoveCount, getOtherPlayer, getCurrentPlayer } from 'reducers';
import Board from 'components/Board';
import ConfirmMoveMenu from '../components/ConfirmMoveMenu';
import GameInfo from '../components/GameInfo';
import MoveHistory from '../components/MoveHistory';
import Player from '../components/Player';

const Wrapper = styled.div`
align-items: center;
display: flex;
flex-direction: column;
height: 100%;
justify-content: space-around;
`;

const GameView = () => {
  // TODO: this is a massive hack -- should not rely on move count to determine
  // if this is the initial load
  const active = useSelector(state =>
    state.gameSlug !== null
    && state.loading
    && getMoveCount(state) <= 1
  );
  const currentPlayer = useSelector(state => getCurrentPlayer(state));
  const otherPlayer =  useSelector(state => getOtherPlayer(state));

  return (
    <Dimmer.Dimmable
      as={Segment}
      basic
      blurring
      dimmed={active}
    >
      <Dimmer active={active} page>
        <Loader>Loading</Loader>
      </Dimmer>
      <Wrapper className="Game">
        <Player {...otherPlayer} />
        <Board legalMoves />
        <Player {...currentPlayer} />
        <GameInfo hasLegalMoves />
        <ConfirmMoveMenu />
        <MoveHistory />
      </Wrapper>
    </Dimmer.Dimmable>
  );
};

export default GameView;
