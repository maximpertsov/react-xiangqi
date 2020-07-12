import update from 'immutability-helper';
import { decodeUci } from 'services/logic/square';

export const movePiece = (placement, uci) => {
  const [fromSlot, toSlot] = decodeUci(uci);

  return update(
    update(placement, {
      [toSlot]: { $set: placement[fromSlot] },
    }),
    {
      [fromSlot]: { $set: null },
    },
  );
};

export const getMovingPiece = (placement, uci) =>
  placement[decodeUci(uci)[0]];

export const getMovedPiece = (placement, uci) =>
  placement[decodeUci(uci)[1]];

export default {};
