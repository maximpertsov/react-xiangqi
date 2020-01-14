// HACK: make first move 0
let nextMoveId = -1;

export const newMove = (moveData) => (
  {
    ...moveData,
    id: ++nextMoveId,
  }
);

export default {};
