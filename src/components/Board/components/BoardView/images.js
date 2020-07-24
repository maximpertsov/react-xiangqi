import flatten from 'lodash/flatten';

import bottom from './assets/square-bottom.svg';
import topLeft from './assets/square-top-left.svg';
import topRight from './assets/square-top-right.svg';
import top from './assets/square-top.svg';

const imageByIndex = Object.freeze([
  [topLeft, top, top, null, null, null, top, top, topRight],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, bottom, bottom, bottom, bottom, bottom, bottom, bottom, null],
  //
  [topLeft, top, top, top, top, top, top, top, topRight],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [null, bottom, bottom, null, null, null, bottom, bottom, null],
]);

const getImageByIndex = i => flatten(imageByIndex)[i];

export default getImageByIndex;
