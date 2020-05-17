import update from 'immutability-helper';
import { decodeFan } from 'services/logic/square';

export const makeMove = (placement, fan) => {
  const [fromSlot, toSlot] = decodeFan(fan);

  return update(
    update(placement, {
      [toSlot]: { $set: placement[fromSlot] },
    }),
    {
      [fromSlot]: { $set: null },
    },
  );
};

export const getMovingPiece = (placement, fan) =>
  placement[decodeFan(fan)[0]];

export const getMovedPiece = (placement, fan) =>
  placement[decodeFan(fan)[1]];

export default {};
