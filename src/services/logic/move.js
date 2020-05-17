import update from 'immutability-helper';
import { decodeFan } from 'services/logic/square';

export const makeMove = (placement, move) => {
  const [fromSlot, toSlot] = decodeFan(move);

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
  placement[decodeFan(move)[0]];

export const getMovedPiece = (placement, move) =>
  placement[decodeFan(move)[1]];

export default {};
