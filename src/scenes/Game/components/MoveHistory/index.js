import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Segment } from 'semantic-ui-react';

import * as styles from 'commonStyles';
import * as logic from 'services/logic';

import Move from './components/Move';

const cssMoveColumns = (columns) => Array(columns)
  .fill('0.25fr 1fr 1fr').join(' ');

const Wrapper = styled.div`
  display: grid;
  ${styles.MEDIA_TINY} {
    grid-template-columns: ${cssMoveColumns(2)};
    font-size: x-small;
  }
  ${styles.MEDIA_SMALL} {
    grid-template-columns: ${cssMoveColumns(2)};
    font-size: x-small;
  }
  ${styles.MEDIA_MEDIUM} {
    grid-template-columns: ${cssMoveColumns(2)};
    font-size: small;
  }
  ${styles.MEDIA_LARGE} {
    grid-template-columns: ${cssMoveColumns(3)};
    font-size: small;
  }
  grid-template-rows: repeat(auto-fill, 1fr);
  font-size: small;
  max-height: 10vh;
  overflow: auto;
`;

const MoveHistory = ({ moves, selectedIdx, handleMoveSelect }) => {
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
      </Wrapper>
    </Segment>
  );
};

MoveHistory.propTypes = {
  // TODO: add move proptype
  moves: PropTypes.arrayOf(logic.boardPropType).isRequired,
  selectedIdx: PropTypes.number.isRequired,
  handleMoveSelect: PropTypes.func.isRequired,
};

export default MoveHistory;
