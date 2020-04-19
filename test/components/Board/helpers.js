export const getSquareNode = (wrapper, square) =>
  wrapper.find('Square').findWhere(node => node.key() == square);

export const clickSquare = (wrapper, square) => {
  getSquareNode(wrapper, square)
    .children()
    .simulate('click');

  jest.runOnlyPendingTimers();

  wrapper.update();
};

export const expectSquaresToBeSelected = (wrapper, count) => {
  expect(wrapper.find('SelectionIndicator')).toHaveLength(count);
};

export const expectSquaresToBeTargeted = (wrapper, count) => {
  expect(wrapper.find('TargetIndicator')).toHaveLength(count);
};

export const expectToHavePiece = (wrapper, square, piece) => {
  const node = getSquareNode(wrapper, square).find(`.Piece .${piece}`);
  expect(node).toHaveLength(1);
};

export const expectToBeEmptySquare = (wrapper, square) => {
  const node = getSquareNode(wrapper, square).find('.Piece');
  expect(node).toHaveLength(0);
};

export default {};
