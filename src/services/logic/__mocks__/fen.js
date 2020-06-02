import { Color } from 'services/logic/constants';

export const activeColor = jest.fn(fen => {
  if (!fen) return;

  const symbol = fen.match(/ ([wb]) ?/)[1];
  return { w: Color.RED, b: Color.BLACK }[symbol];
});

export const moveOrder = jest.fn(fen => {
  if (!fen) return;

  return +fen.match(/\d+/)[0];
});

export default {};
