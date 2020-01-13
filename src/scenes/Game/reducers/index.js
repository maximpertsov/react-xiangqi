import * as actions from './actions';

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
  case 'select_move':
    return actions.setSelectedMove(state, action.moveId);
  case 'select_previous_move':
    return actions.setPreviousMove(state);
  case 'select_next_move':
    return actions.setNextMove(state);
  case 'set_moves':
    return actions.setMoves(state, action.moves);
  // TODO: handle player actions into another reducer?
  case 'set_players':
    return ({ ...state, players: action.players });
  default:
    return state;
  }
};

export default reducer;
