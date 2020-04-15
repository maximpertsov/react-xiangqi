import React from 'react';
import { shallow } from 'enzyme';
import Piece from 'components/Board/components/BoardView/components/Piece';
import { ALL_PIECES } from 'services/logic/constants';

describe('Piece', () => {
  test.each(ALL_PIECES)('with code %s', code => {
    const wrapper = shallow(<Piece code={code} />);
    expect(wrapper).toMatchSnapshot();
  });

  test.each(ALL_PIECES)('moving with code %s', code => {
    const wrapper = shallow(<Piece code={code} moveX={1} moveY={2} />);
    expect(wrapper).toMatchSnapshot();
  });
});
