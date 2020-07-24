import bgA10 from './assets/square-a10.svg';
import bgB10 from './assets/square-b10.svg';

const imageByIndex = Object.freeze([
  bgA10,
  bgB10,
  bgB10,
  null,
  null,
  null,
  null,
  null,
]);

const getImageByIndex = i => imageByIndex[i];

export default getImageByIndex;
