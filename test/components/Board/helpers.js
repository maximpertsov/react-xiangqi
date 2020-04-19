const getSquareNodes = (wrapper, squares) =>
  wrapper.find('Square').findWhere(node => squares.includes(node.key()));

const getSquareNode = (wrapper, square) => getSquareNodes(wrapper, [square]);

export const clickSquare = (wrapper, square) => {
  getSquareNode(wrapper, square)
    .children()
    .simulate('click');

  jest.runOnlyPendingTimers();

  wrapper.update();
};

export const expectSquaresToBeSelected = (wrapper, squares) => {
  const nodes = getSquareNodes(wrapper, squares).find('SelectionIndicator');
  expect(nodes).toHaveLength(squares.length);
};

export const expectSquaresToBeTargeted = (wrapper, squares) => {
  const nodes = getSquareNodes(wrapper, squares).find('TargetIndicator');
  expect(nodes).toHaveLength(squares.length);
};

export const expectSquaresToBeInLastMove = (wrapper, squares) => {
  const nodes = getSquareNodes(wrapper, squares).find('LastMoveIndicator');
  expect(nodes).toHaveLength(squares.length);
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
