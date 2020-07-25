import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import isEqual from 'lodash/isEqual';

import actions from 'actions';
import { getBottomPlayerIsRed } from 'reducers';

import BoardView from './components/BoardView';

const mapStateToProps = createSelector(
  state => state,

  state => ({
    bottomPlayerIsRed: getBottomPlayerIsRed(state),
  }),
);

const Board = () => {
  const dispatch = useDispatch();

  const { bottomPlayerIsRed } = useSelector(mapStateToProps, isEqual);

  useEffect(() => {
    dispatch(actions.board.selectedSquare.set(null));
  }, [dispatch]);

  return <BoardView teamBlackPOV={!bottomPlayerIsRed} />;
};

export default Board;
