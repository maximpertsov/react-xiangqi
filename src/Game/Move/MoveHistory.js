import React, { useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Segment } from 'semantic-ui-react';

import Move from './Move';
import { boardPropType } from '../../logic';
import * as styles from '../../commonStyles';

// TODO: set max-height by percentage?
// TODO: hide scroll bar?
// TODO: move colors to constants

/* eslint-disable max-len */
const CSS_COLUMNS_SMALL = 'grid-template-columns: 0.25fr 1fr 1fr 0.25fr 1fr 1fr;';
const CSS_COLUMNS_LARGE = 'grid-template-columns: 0.25fr 1fr 1fr 0.25fr 1fr 1fr 0.25fr 1fr 1fr;';
/* eslint-enable max-len */

const Wrapper = styled.div`
  display: grid;
  ${styles.MEDIA_TINY} {
    ${CSS_COLUMNS_SMALL}
  }
  ${styles.MEDIA_SMALL} {
    ${CSS_COLUMNS_SMALL}
  }
  ${styles.MEDIA_MEDIUM} {
    ${CSS_COLUMNS_LARGE}
  }
  ${styles.MEDIA_LARGE} {
    ${CSS_COLUMNS_LARGE}
  }
  grid-template-rows: repeat(auto-fill, 1fr);
  overflow: auto;
  font-size: x-small;
`;

const MoveHistory = ({ moves, selectedIdx, handleMoveSelect }) => {
  const [bottomElement, setBottomElement] = useState(undefined);

  useLayoutEffect(
    () => {
      const scrollToBottom = () => {
        try {
          bottomElement.scrollIntoView();
        } catch (e) {
          if (!(e instanceof TypeError)) { throw e; }
        }
      };
      scrollToBottom();
    },
    [bottomElement, moves],
  );

  const moveComponents = moves
    .reduce((acc, m, i) => (
      acc.concat(
        // HACK: counting starts at second element
        i % 2 === 1 ? [`${Math.ceil(i / 2)}.`] : [],
        [
          <Move
            key={i}
            idx={i}
            handleMoveSelect={handleMoveSelect}
            fromPos={m.fromPos}
            toPos={m.toPos}
            piece={m.piece}
            selected={selectedIdx === i}
          />,
        ],
      )),
    [],
    );

  return (
    <Segment clearing tertiary>
      <Wrapper>
        {moveComponents}
        <div ref={setBottomElement} />
      </Wrapper>
    </Segment>
  );
};

MoveHistory.propTypes = {
  // TODO: add move proptype
  moves: PropTypes.arrayOf(boardPropType).isRequired,
  selectedIdx: PropTypes.number.isRequired,
  handleMoveSelect: PropTypes.func.isRequired,
};

export default MoveHistory;
