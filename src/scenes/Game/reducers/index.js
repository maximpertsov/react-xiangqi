import { combineReducers } from 'redux';
import loading from 'scenes/Game/reducers/loading';
import moves from 'scenes/Game/reducers/moves';
import players from 'scenes/Game/reducers/players';
import selectedMoveId from 'scenes/Game/reducers/selectedMoveId';

/* eslint-disable-next-line complexity */
const game = combineReducers({ loading, moves, players, selectedMoveId });

export default game;
