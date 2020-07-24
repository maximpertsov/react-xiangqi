import flatten from 'lodash/flatten';

import botLeft from './assets/square-bottom-left.svg';
import botRight from './assets/square-bottom-right.svg';
import bot from './assets/square-bottom.svg';
import inner from './assets/square-inner.svg';
import left from './assets/square-left.svg';
import lpTopLeft from './assets/square-lower-palace-top-left.svg';
import pCenter from './assets/square-palace-center.svg';
import right from './assets/square-right.svg';
import topLeft from './assets/square-top-left.svg';
import topRight from './assets/square-top-right.svg';
import top from './assets/square-top.svg';

const imageByIndex = Object.freeze([
  [topLeft, top, top, lpTopLeft, null, null, top, top, topRight],
  [left, inner, inner, inner, pCenter, inner, inner, inner, right],
  [left, inner, inner, null, inner, null, inner, inner, right],
  [left, inner, inner, inner, inner, inner, inner, inner, right],
  [botLeft, bot, bot, bot, bot, bot, bot, bot, botRight],
  [topLeft, top, top, top, top, top, top, top, topRight],
  [left, inner, inner, inner, inner, inner, inner, inner, right],
  [left, inner, inner, null, inner, null, inner, inner, right],
  [left, inner, inner, inner, pCenter, inner, inner, inner, right],
  [botLeft, bot, bot, null, null, null, bot, bot, botRight],
]);

const getImageByIndex = i => flatten(imageByIndex)[i];

export default getImageByIndex;
