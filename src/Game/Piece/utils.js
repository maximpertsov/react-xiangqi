import { getPieceData } from './Piece';

const layout = [
  'rheakaehr',
  '         ',
  ' c     c ',
  'p p p p p',
  '         ',
  // ~~~~~~~~
  '         ',
  'P P P P P',
  ' C     C ',
  '         ',
  'RHEAKAEHR',
].map((row) => row.split('').map((ch) => getPieceData(ch)));

export default layout;
