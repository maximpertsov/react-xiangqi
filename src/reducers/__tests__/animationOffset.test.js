import { getIsMoving } from 'reducers/animationOffset';

describe('animation offset selectors', () => {
  test('is moving', () => {
    expect(getIsMoving([0, 0])).toEqual(false);
    expect(getIsMoving([1, 0])).toEqual(true);
    expect(getIsMoving([0, -1])).toEqual(true);
    expect(getIsMoving([-1, 1])).toEqual(true);
  });
});
