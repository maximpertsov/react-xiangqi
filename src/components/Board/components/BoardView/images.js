import flatten from 'lodash/flatten';

import botLeft from './assets/square-bottom-left.svg';
import botRight from './assets/square-bottom-right.svg';
import bot from './assets/square-bottom.svg';
import inner from './assets/square-inner.svg';
import left from './assets/square-left.svg';
import pCenter from './assets/square-palace-center.svg';
import right from './assets/square-right.svg';
import topLeft from './assets/square-top-left.svg';
import topRight from './assets/square-top-right.svg';
import top from './assets/square-top.svg';
import upBotLeft from './assets/square-upper-palace-bottom-left.svg';
import upBotRight from './assets/square-upper-palace-bottom-right.svg';
import upTopLeft from './assets/square-upper-palace-top-left.svg';
import upTopRight from './assets/square-upper-palace-top-right.svg';

import lpBotLeft from './assets/square-lower-palace-bottom-left.svg';
import lpBotRight from './assets/square-lower-palace-bottom-right.svg';
import lpTopLeft from './assets/square-lower-palace-top-left.svg';
import lpTopRight from './assets/square-lower-palace-top-right.svg';

const imageByIndex = Object.freeze([
  [topLeft, top, top, upTopLeft, top, upTopRight, top, top, topRight],
  [left, inner, inner, inner, pCenter, inner, inner, inner, right],
  [left, inner, inner, upBotLeft, inner, upBotRight, inner, inner, right],
  [left, inner, inner, inner, inner, inner, inner, inner, right],
  [botLeft, bot, bot, bot, bot, bot, bot, bot, botRight],
  [topLeft, top, top, top, top, top, top, top, topRight],
  [left, inner, inner, inner, inner, inner, inner, inner, right],
  [left, inner, inner, lpTopLeft, inner, lpTopRight, inner, inner, right],
  [left, inner, inner, inner, pCenter, inner, inner, inner, right],
  [botLeft, bot, bot, lpBotLeft, bot, lpBotRight, bot, bot, botRight],
]);

const getImageByIndex = i => flatten(imageByIndex)[i];

export default getImageByIndex;
