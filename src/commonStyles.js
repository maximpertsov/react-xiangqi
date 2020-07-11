import mapValues from 'lodash/mapValues';

export const MediaQuery = Object.freeze({
  TINY: '@media (max-width: 360px)',
  SMALL: '@media (min-width: 360px) and (max-width: 540px)',
  MEDIUM: '@media (min-width: 540px) and (max-width: 720px)',
  LARGE: '@media (min-width: 720px)',
});

const SquarePixels = Object.freeze({
  TINY: 20,
  SMALL: 30,
  MEDIUM: 45,
  LARGE: 55,
});

export const SquareSize = Object.freeze(
  mapValues(SquarePixels, value => `${value}px`),
);

export const WidthSize = Object.freeze(
  mapValues(SquarePixels, value => `${value * 9 * 0.85}px`),
);

export const SELECTION_COLOR = 'rgba(30,179,0,0.3)';

export const fillParentElement = {
  height: '100%',
  width: '100%',
  position: 'absolute',
};

export default {};
