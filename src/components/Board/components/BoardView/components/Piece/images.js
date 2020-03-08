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
  k: blackGeneral,
  a: blackAdvisor,
  b: blackElephant,
  n: blackHorse,
  r: blackChariot,
  c: blackCannon,
  p: blackSoldier,
  K: redGeneral,
  A: redAdvisor,
  B: redElephant,
  N: redHorse,
  R: redChariot,
  C: redCannon,
  P: redSoldier,
};

const getImageByCode = code => imageByCode[code];

export default getImageByCode;
