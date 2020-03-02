import update from 'immutability-helper';
import { decodeMove } from 'services/logic/square';

export const makeMove = (placement, move) => {
  const [fromSlot, toSlot] = decodeMove(move);

  return update(
    update(placement, {
      [toSlot]: { $set: placement[fromSlot] },
    }),
    {
      [fromSlot]: { $set: null },
    },
  );
};

export const getMovingPiece = (placement, move) => {
  const [fromSlot] = decodeMove(move);

  return placement[fromSlot];
};

export default {};
