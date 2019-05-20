const RANKS = 10;
const FILES = 9;

export const getIndex = (rank, file) => file + rank * FILES;
export const getRank = (i) => Math.ceil(i / RANKS);
export const getFile = (i) => i % FILES;

function fromFenRow(row) {
  return row.split('').reduce((acc, ch) => {
    const val = +ch;
    const newItems = Number.isNaN(val) ? [ch] : Array(val).fill(null);
    return acc.concat(newItems);
  }, []);
}

export function fromFen(fen) {
  return fen.split('/').reduce((acc, row) => acc.concat(fromFenRow(row)), []);
}

export function legalMoves(board) {
}

export default {};
