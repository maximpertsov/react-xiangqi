import React, { Component } from 'react';
import PropTypes from 'prop-types';

import XiangqiBoard from '../logic';

export const GameContext = React.createContext();

const initialMoves = [
  {
    piece: undefined,
    fromPos: undefined,
    toPos: undefined,
    board: new XiangqiBoard(),
  },
];

const initialPlayers = [
  // TODO: allow for same display name?
  { name: '', color: 'red' },
  { name: ' ', color: 'black' },
];

export default class GameProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientUpdatedAt: null,
      moves: initialMoves,
      players: initialPlayers,
      selectedMoveIdx: 0,
      selectedSlot: null,
      timer: null,
      username: null,
    };
  }

  getContext() {
    const { state } = this;

    return {
      // state
      ...state,

      // actions
      set: (update) => { this.setState(update); },
      selectSquare: ({ slot }) => {
        this.setState({ selectedSlot: slot === null ? undefined : slot });
      },

      // computed
      get userPlayer() {
        return state.players.find((p) => p.name === state.username) || {};
      },
    };
  }

  render() {
    const { children } = this.props;
    return (
      <GameContext.Provider value={this.getContext()}>
        {children}
      </GameContext.Provider>
    );
  }
}


GameProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
