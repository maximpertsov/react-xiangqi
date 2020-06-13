import React from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { Button, Dimmer, Icon, Loader, Segment } from 'semantic-ui-react';

import {
  getCurrentPlayer,
  getHasInitialPlacement,
  getOpponent,
} from 'reducers';
import Board from 'components/Board';
import GameMenu from 'components/GameMenu';
import ConfirmMoveMenu from './ConfirmMoveMenu';
import GameInfo from './GameInfo';
import MoveHistory from './MoveHistory';
import Player from './Player';
import TakebackButton from './TakebackButton';
import DrawButton from './DrawButton';
import ResignButton from './ResignButton';

const mapStateToProps = state => ({
  currentPlayer: getCurrentPlayer(state),
  hasInitialPlacement: getHasInitialPlacement(state),
  opponent: getOpponent(state),
  showConfirmMoveMenu: state.showConfirmMoveMenu,
});

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-around;
`;

// eslint-disable-next-line complexity
const GameView = () => {
  const {
    hasInitialPlacement,
    showConfirmMoveMenu,
    currentPlayer,
    opponent,
  } = useSelector(state => mapStateToProps(state), isEqual);

  const renderActionsMenu = () => (
    <GameMenu>
      <TakebackButton />
      <DrawButton />
      <ResignButton />
    </GameMenu>
  );

  return (
    <Dimmer.Dimmable as={Segment} basic blurring dimmed={!hasInitialPlacement}>
      <Dimmer active={!hasInitialPlacement} page>
        <Loader>Loading</Loader>
      </Dimmer>
      {hasInitialPlacement && (
        <Wrapper className="Game">
          <Player {...opponent} />
          <Board legalMoves />
          <ConfirmMoveMenu />
          {!showConfirmMoveMenu && renderActionsMenu()}
          {!showConfirmMoveMenu && <Player {...currentPlayer} />}
          {!showConfirmMoveMenu && <GameInfo hasLegalMoves />}
          {!showConfirmMoveMenu && <MoveHistory />}
        </Wrapper>
      )}
    </Dimmer.Dimmable>
  );
};

export default GameView;
