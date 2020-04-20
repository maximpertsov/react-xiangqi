import React from 'react';
import styled from '@emotion/styled';
import { useSelector, shallowEqual } from 'react-redux';
import { Button, Dimmer, Icon, Loader, Segment } from 'semantic-ui-react';
import {
  getCurrentPlayer,
  getHasInitialPlacement,
  getIsLastMovePending,
  getOtherPlayer,
} from 'reducers';
import Board from 'components/Board';
import GameMenu from 'components/GameMenu';

import ConfirmMoveMenu from './ConfirmMoveMenu';
import GameInfo from './GameInfo';
import MoveHistory from './MoveHistory';
import Player from './Player';
import TakebackButton from './TakebackButton';

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-around;
`;

// eslint-disable-next-line complexity
const GameView = () => {
  const hasInitialPlacement = useSelector(state =>
    getHasInitialPlacement(state),
  );
  const isLastMovePending = useSelector(state => getIsLastMovePending(state));
  const currentPlayer = useSelector(state => getCurrentPlayer(state), shallowEqual);
  const otherPlayer = useSelector(state => getOtherPlayer(state), shallowEqual);

  const renderActionsMenu = () => (
    <GameMenu>
      <TakebackButton />
      <Button>
        <Icon fitted name="handshake outline" />
      </Button>
      <Button>
        <Icon fitted name="flag outline" />
      </Button>
    </GameMenu>
  );

  return (
    <Dimmer.Dimmable as={Segment} basic blurring dimmed={!hasInitialPlacement}>
      <Dimmer active={!hasInitialPlacement} page>
        <Loader>Loading</Loader>
      </Dimmer>
      {hasInitialPlacement && (
        <Wrapper className="Game">
          <Player {...otherPlayer} />
          <Board legalMoves />
          <ConfirmMoveMenu />
          {!isLastMovePending && renderActionsMenu()}
          {!isLastMovePending && <Player {...currentPlayer} />}
          {!isLastMovePending && <GameInfo hasLegalMoves />}
          {!isLastMovePending && <MoveHistory />}
        </Wrapper>
      )}
    </Dimmer.Dimmable>
  );
};

export default GameView;
