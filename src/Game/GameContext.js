import React, { Component } from 'react';

import XiangqiBoard from '../logic';

export const GameContext = React.createContext();

export class GameProvider extends Component {
  constructor(props) {
    super(props);
    /* eslint-disable react/no-unused-state */
    this.state = {
      clientUpdatedAt: null,
      moves: [
        {
          piece: undefined,
          fromPos: undefined,
          toPos: undefined,
          board: new XiangqiBoard(),
        },
      ],
      players: [
        // TODO: allow for same display name?
        { name: '', color: 'red' },
        { name: ' ', color: 'black' },
      ],
      selectedMoveIdx: 0,
      selectedSlot: null,
      timer: null,
      username: null,

      // Action
      set: (update) => { this.setState(update); },
    };
    /* eslint-enable react/no-unused-state */
  }

  render() {
    return (
      <GameContext.Provider value={this.state}>
        {this.props.children}
      </GameContext.Provider>
    );
  }
}

export default {};
