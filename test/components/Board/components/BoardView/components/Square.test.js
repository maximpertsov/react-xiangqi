import React from 'react';
import { render } from 'enzyme';

import Square from 'components/Board/components/BoardView/components/Square';

describe('Square', () => {
  test('renders without crashing', () => {
    const wrapper = render(<Square />);
    expect(wrapper).toMatchSnapshot();
  });
});
