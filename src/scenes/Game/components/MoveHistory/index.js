import React from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { Segment } from 'semantic-ui-react';
import { tail, chunk } from 'lodash';

import * as styles from 'commonStyles';
import FullMove from './components/FullMove';

const cssMoveColumns = (columns) =>
  Array(columns).fill('1fr').join(' ');

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

const MoveHistory = () => {
  const moves = useSelector(({ game: { moves } }) => moves);

  const fullMoves = chunk(tail(moves), 2)
    .map(([redMove, blackMove], index) =>
      (<FullMove
        key={index}
        ordering={index + 1}
        redMove={redMove}
        blackMove={blackMove}
      />)
    );

  return (
    <Segment clearing tertiary>
      <Wrapper>
        {fullMoves}
      </Wrapper>
    </Segment>
  );
};

export default MoveHistory;
