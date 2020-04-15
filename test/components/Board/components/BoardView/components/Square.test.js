import React from 'react';
import { shallow } from 'enzyme';

import Square from 'components/Board/components/BoardView/components/Square';

describe('Square', () => {
  test('renders without crashing', () => {
    const wrapper = shallow(<Square />);
    expect(wrapper).toMatchSnapshot();
  });
});
