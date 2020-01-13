import { players } from 'scenes/Game/reducers/players';
import { moves } from 'scenes/Game/reducers/moves';
import { selectedMoveId } from 'scenes/Game/reducers/selectedMoveId';

import * as actions from '../actions';

/* eslint-disable-next-line complexity */
const reducer = (state = actions.getInitialState(), action) => {
  switch (action.type) {
  case 'add_move':
    return actions.addMove(
      state,
      action.board,
      action.fromSlot,
      action.toSlot,
      action.pending,
    );
  case 'cancel_moves':
    return actions.cancelMoves(state);
  case 'confirm_moves':
    return actions.confirmMoves(state);
  case 'set_moves':
    return actions.setMoves(state, action.moves);
  case 'select_move':
    return actions.setSelectedMove(state, action.moveId);
  case 'select_previous_move':
    return actions.setPreviousMove(state);
  case 'select_next_move':
    return actions.setNextMove(state);
  // TODO: split into players
  case 'set_players':
    return { ...state, players: players(state.players, action) };
  default:
    return state;
  }
};


export default reducer;
