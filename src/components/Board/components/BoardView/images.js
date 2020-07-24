import topLeft from './assets/square-top-left.svg';
import topRight from './assets/square-top-right.svg';
import top from './assets/square-top.svg';

const imageByIndex = Object.freeze([
  topLeft,
  top,
  top,
  null,
  null,
  null,
  top,
  top,
  topRight,
]);

const getImageByIndex = i => imageByIndex[i];

export default getImageByIndex;
