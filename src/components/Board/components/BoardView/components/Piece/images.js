import { Piece } from 'services/logic/constants';

import blackAdvisor from './black-advisor-50px.svg.png';
import redAdvisor from './red-advisor-50px.svg.png';
import blackCannon from './black-cannon-50px.svg.png';
import redCannon from './red-cannon-50px.svg.png';
import blackChariot from './black-chariot-50px.svg.png';
import redChariot from './red-chariot-50px.svg.png';
import blackHorse from './black-horse-50px.svg.png';
import redHorse from './red-horse-50px.svg.png';
import blackElephant from './black-elephant-50px.svg.png';
import redElephant from './red-elephant-50px.svg.png';
import blackGeneral from './black-general-50px.svg.png';
import redGeneral from './red-general-50px.svg.png';
import blackSoldier from './black-soldier-50px.svg.png';
import redSoldier from './red-soldier-50px.svg.png';

const imageByCode = {
  [Piece.Black.GENERAL]: blackGeneral,
  [Piece.Black.ADVISOR]: blackAdvisor,
  [Piece.Black.ELEPHANT]: blackElephant,
  [Piece.Black.HORSE]: blackHorse,
  [Piece.Black.CHARIOT]: blackChariot,
  [Piece.Black.CANNON]: blackCannon,
  [Piece.Black.PAWN]: blackSoldier,
  [Piece.Red.GENERAL]: redGeneral,
  [Piece.Red.ADVISOR]: redAdvisor,
  [Piece.Red.ELEPHANT]: redElephant,
  [Piece.Red.HORSE]: redHorse,
  [Piece.Red.CHARIOT]: redChariot,
  [Piece.Red.CANNON]: redCannon,
  [Piece.Red.PAWN]: redSoldier,
};

const getImageByCode = code => imageByCode[code];

export default getImageByCode;
