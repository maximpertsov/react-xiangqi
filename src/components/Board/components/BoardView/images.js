import flatten from 'lodash/flatten';

import bottomLeft from './assets/square-bottom-left.svg';
import bottomRight from './assets/square-bottom-right.svg';
import bottom from './assets/square-bottom.svg';
import inner from './assets/square-inner.svg';
import left from './assets/square-left.svg';
import right from './assets/square-right.svg';
import topLeft from './assets/square-top-left.svg';
import topRight from './assets/square-top-right.svg';
import top from './assets/square-top.svg';

const imageByIndex = Object.freeze([
  [topLeft, top, top, null, null, null, top, top, topRight],
  [left, inner, inner, null, null, null, inner, inner, right],
  [left, inner, inner, null, null, null, inner, inner, right],
  [left, inner, inner, inner, inner, inner, inner, inner, right],
  [bottomLeft, bottom, bottom, bottom, bottom, bottom, bottom, bottom, bottomRight],
  //
  [topLeft, top, top, top, top, top, top, top, topRight],
  [left, inner, inner, inner, inner, inner, inner, inner, right],
  [left, inner, inner, null, null, null, inner, inner, right],
  [left, inner, inner, null, null, null, inner, inner, right],
  [bottomLeft, bottom, bottom, null, null, null, bottom, bottom, bottomRight],
]);

const getImageByIndex = i => flatten(imageByIndex)[i];

export default getImageByIndex;
