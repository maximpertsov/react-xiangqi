import React, { Component } from 'react';

export const GameContext = React.createContext();

export class GameProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMoveIdx: 0,
    };
  }

  get selectedMoveIdx() {
    const { selectedMoveIdx } = this.state;
    return selectedMoveIdx;
  }

  setSelectedMoveIdx(idx) {
    this.setState({ selectedMoveIdx: idx });
  }

  render() {
    return (
      <GameContext.Provider value={this}>
        {this.props.children}
      </GameContext.Provider>
    );
  }
}

export default {};
