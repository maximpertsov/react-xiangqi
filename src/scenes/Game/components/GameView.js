import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { Button, Dimmer, Icon, Loader, Segment } from 'semantic-ui-react';
import {
  getCurrentPlayer,
  getIsLastMovePending,
  getOtherPlayer,
} from 'reducers';
import Board from 'components/Board';
import GameMenu from 'components/GameMenu';
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
  const movesFetched = useSelector(state => state.movesFetched);
  const isLastMovePending = useSelector(state => getIsLastMovePending(state));
  const currentPlayer = useSelector(state => getCurrentPlayer(state));
  const otherPlayer = useSelector(state => getOtherPlayer(state));

  const renderActionsMenu = () => (
    <GameMenu>
      <Button>
        <Icon fitted name="undo" />
      </Button>
      <Button>
        <Icon fitted name="handshake outline" />
      </Button>
      <Button>
        <Icon fitted name="flag outline" />
      </Button>
    </GameMenu>
  );

  return (
    <Dimmer.Dimmable as={Segment} basic blurring dimmed={!movesFetched}>
      <Dimmer active={!movesFetched} page>
        <Loader>Loading</Loader>
      </Dimmer>
      <Wrapper className="Game">
        <Player {...otherPlayer} />
        <Board legalMoves />
        <ConfirmMoveMenu />
        {!isLastMovePending && renderActionsMenu()}
        <Player {...currentPlayer} />
        <GameInfo hasLegalMoves />
        <MoveHistory />
      </Wrapper>
    </Dimmer.Dimmable>
  );
};

export default GameView;
