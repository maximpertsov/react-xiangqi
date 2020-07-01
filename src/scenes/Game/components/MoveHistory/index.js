import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { Button, Icon, Segment } from 'semantic-ui-react';
import { tail, chunk, isEqual } from 'lodash';

// TODO: move to separate class
import actions from 'actions';
import { getPreviousMoveFen, getNextMoveFen } from 'reducers';

import { MediaQuery, WidthSize } from 'commonStyles';
import Move from './components/Move';
import FullMove from './components/FullMove';

const Wrapper = styled.div`
  ${MediaQuery.TINY} {
    font-size: x-small;
    width: ${WidthSize.TINY};
  }
  ${MediaQuery.SMALL} {
    font-size: x-small;
    width: ${WidthSize.SMALL};
  }
  ${MediaQuery.MEDIUM} {
    font-size: small;
    width: ${WidthSize.MEDIUM};
  }
  ${MediaQuery.LARGE} {
    font-size: small;
    width: ${WidthSize.LARGE};
  }
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  overflow: hidden;
`;

const MovesWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
`;

const MoveHistory = () => {
  const dispatch = useDispatch();

  // TODO: move to separate class
  const previousMoveFen = useSelector(state => getPreviousMoveFen(state));
  const nextMoveFen = useSelector(state => getNextMoveFen(state), isEqual);

  const moves = useSelector(state => state.moves, isEqual);
  const moveComponents = moves.map((move, index) => (
    <Move key={index} uci={move.uci} fen={move.fen} />
  ));
  const fullMoves = chunk(tail(moveComponents), 2).map(
    ([player1Move, player2Move], index) => (
      <FullMove key={index} ordering={index + 1}>
        {player1Move}
        {player2Move}
      </FullMove>
    ),
  );

  return (
    <Segment tertiary>
      <Wrapper>
        <Button size="tiny" compact icon>
          <Icon
            onClick={() =>
              dispatch(actions.game.selectedFen.set(previousMoveFen))
            }
            fitted
            name="step backward"
          />
        </Button>
        <MovesWrapper className="MoveHistory">{fullMoves}</MovesWrapper>
        <Button
          onClick={() => dispatch(actions.game.selectedFen.set(nextMoveFen))}
          size="small"
          compact
          icon
        >
          <Icon fitted name="step forward" />
        </Button>
      </Wrapper>
    </Segment>
  );
};

export default MoveHistory;
