const getSquareNode = (wrapper, square) =>
  wrapper.find('Square').findWhere(node => node.key() == square);

const getSquareNodesWrapper = (wrapper, squares) =>
  wrapper.find('Square').filterWhere(node => squares.includes(node.key()));

export const clickSquare = (wrapper, square) => {
  getSquareNode(wrapper, square)
    .children()
    .simulate('click');

  jest.runOnlyPendingTimers();

  wrapper.update();
};

export const expectSquaresToBeSelected = (wrapper, squares) => {
  const selectedSquares = getSquareNodesWrapper(wrapper, squares).find(
    'SelectionIndicator',
  );
  expect(selectedSquares).toHaveLength(squares.length);
};

export const expectSquaresToBeTargeted = (wrapper, squares) => {
  const targetedSquares = getSquareNodesWrapper(wrapper, squares).find(
    'TargetIndicator',
  );
  expect(targetedSquares).toHaveLength(squares.length);
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
