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

export const getMovingPiece = (placement, move) =>
  placement[decodeMove(move)[0]];

export const getMovedPiece = (placement, move) =>
  placement[decodeMove(move)[1]];

export default {};
