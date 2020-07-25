import React from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import isEqual from 'lodash/isEqual';

import BoardView from 'components/Board/components/BoardView';
import GameMenu from 'components/GameMenu';
import {
  getBottomPlayerIsRed,
  getCurrentPlayer,
  getHasInitialPlacement,
  getOpponent,
} from 'reducers';

import ConfirmMoveMenu from './ConfirmMoveMenu';
import DrawButton from './DrawButton';
import GameInfo from './GameInfo';
import MoveHistory from './MoveHistory';
import Player from './Player';
import ResignButton from './ResignButton';
import TakebackButton from './TakebackButton';

const mapStateToProps = state => ({
  bottomPlayerIsRed: getBottomPlayerIsRed(state),
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
    bottomPlayerIsRed,
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
          <BoardView teamBlackPOV={!bottomPlayerIsRed} />
          <Player {...currentPlayer} />
          <GameInfo />
          {!showConfirmMoveMenu && (
            <Segment>
              {renderActionsMenu()}
              <MoveHistory />
            </Segment>
          )}
          <ConfirmMoveMenu />
        </Wrapper>
      )}
    </Dimmer.Dimmable>
  );
};

export default GameView;
