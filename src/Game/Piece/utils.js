import React from 'react';
import * as pieces from './Piece';


const layout = [...Array(10)].map(() => [...Array(9)]);

const layout2 = [
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
].map((row) => row.split(''));

// board layout
// black back row
layout[0][0] = <pieces.BlackChariot />;
layout[0][1] = <pieces.BlackHorse />;
layout[0][2] = <pieces.BlackElephant />;
layout[0][3] = <pieces.BlackAdvisor />;
layout[0][4] = <pieces.BlackGeneral />;
layout[0][5] = <pieces.BlackAdvisor />;
layout[0][6] = <pieces.BlackElephant />;
layout[0][7] = <pieces.BlackHorse />;
layout[0][8] = <pieces.BlackChariot />;
// black cannons
layout[2][1] = <pieces.BlackCannon />;
layout[2][7] = <pieces.BlackCannon />;
// black pawns
layout[3][0] = <pieces.BlackSoldier />;
layout[3][2] = <pieces.BlackSoldier />;
layout[3][4] = <pieces.BlackSoldier />;
layout[3][6] = <pieces.BlackSoldier />;
layout[3][8] = <pieces.BlackSoldier />;

// black back row
layout[9][0] = <pieces.RedChariot />;
layout[9][1] = <pieces.RedHorse />;
layout[9][2] = <pieces.RedElephant />;
layout[9][3] = <pieces.RedAdvisor />;
layout[9][4] = <pieces.RedGeneral />;
layout[9][5] = <pieces.RedAdvisor />;
layout[9][6] = <pieces.RedElephant />;
layout[9][7] = <pieces.RedHorse />;
layout[9][8] = <pieces.RedChariot />;
// black cannons
layout[7][1] = <pieces.RedCannon />;
layout[7][7] = <pieces.RedCannon />;
// black pawns
layout[6][0] = <pieces.RedSoldier />;
layout[6][2] = <pieces.RedSoldier />;
layout[6][4] = <pieces.RedSoldier />;
layout[6][6] = <pieces.RedSoldier />;
layout[6][8] = <pieces.RedSoldier />;

export default layout;
