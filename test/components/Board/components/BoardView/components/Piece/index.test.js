import React from 'react';
import { render } from 'enzyme';
import Piece from '../../../../../../../src/components/Board/components/BoardView/components/Piece';
import { ALL_PIECES } from '../../../../../../../src/services/logic/constants';

describe('Piece', () => {
  test.each(ALL_PIECES)('with code %s', code => {
    const wrapper = render(<Piece code={code} />);
    expect(wrapper).toMatchSnapshot();
  });

  test.each(ALL_PIECES)('moving with code %s', code => {
    const wrapper = render(<Piece code={code} moveX={1} moveY={2} />);
    expect(wrapper).toMatchSnapshot();
  });
});
