import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { Button, Icon, Segment } from 'semantic-ui-react';

import chunk from 'lodash/fp/chunk';
import flow from 'lodash/fp/flow';
import isEqual from 'lodash/fp/isEqual';
import map from 'lodash/fp/map';
import tail from 'lodash/fp/tail';

import { createSelector } from 'reselect';

import actions from 'actions';
// TODO: move to separate class
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

const mapStateToProps = createSelector(
  [
    state => state.moves.map(({ fen, uci }, index) => ({ index, fen, uci })),
    // TODO: move to separate class
    state => getPreviousMoveFen(state),
    state => getNextMoveFen(state),
  ],
  (movesData, previousMoveFen, nextMoveFen) => ({
    movesData,
    previousMoveFen,
    nextMoveFen,
  }),
);

const MoveHistory = () => {
  const dispatch = useDispatch();

  const { movesData, previousMoveFen, nextMoveFen } = useSelector(
    mapStateToProps,
    isEqual,
  );

  const renderFullMoves = () =>
    flow(
      tail,
      chunk(2),
      map.convert({ cap: false })(
        ([player1MoveData, player2MoveData], index) => (
          <FullMove key={index} ordering={index + 1}>
            <Move {...player1MoveData} />
            <Move {...player2MoveData} />
          </FullMove>
        ),
      ),
    )(movesData);

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
        <MovesWrapper className="MoveHistory">{renderFullMoves()}</MovesWrapper>
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
