import { Team } from 'services/logic/constants';

export const activeTeam = jest.fn(fen => {
  if (!fen) return;

  const symbol = fen.match(/ ([wb]) ?/)[1];
  return { w: Team.RED, b: Team.BLACK }[symbol];
});

export const moveOrder = jest.fn(fen => {
  if (!fen) return;

  return +fen.match(/\d+/)[0];
});

export default {};
