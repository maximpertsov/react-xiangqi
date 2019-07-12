import { createContext } from 'react';
import { observable, action } from 'mobx';

export const gameState = observable({
  selectedMoveIdx: 0,

  setSelectedMoveIdx(idx) {
    this.selectedMoveIdx = idx;
  },
}, {
  setSelectedMoveIdx: action,
});


export const GameState = createContext(gameState);

export default {};
