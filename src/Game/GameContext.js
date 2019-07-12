import React, { Component } from 'react';

export const GameContext = React.createContext();

export class GameProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 10,
      inc: () => {
        this.setState((prevState) => ({ number: prevState.number + 1 }));
      },
    };
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
