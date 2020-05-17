import React from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { Segment } from 'semantic-ui-react';
import { tail, chunk, isEqual } from 'lodash';

import { MediaQuery, WidthSize } from 'commonStyles';
import Move from './components/Move';
import FullMove from './components/FullMove';

const repeatItemCSS = times =>
  Array(times)
    .fill('1fr')
    .join(' ');

const Wrapper = styled.div`
  display: grid;
  ${MediaQuery.TINY} {
    grid-template-columns: ${repeatItemCSS(2)};
    font-size: x-small;
    width: ${WidthSize.TINY};
  }
  ${MediaQuery.SMALL} {
    grid-template-columns: ${repeatItemCSS(2)};
    font-size: x-small;
    width: ${WidthSize.SMALL};
  }
  ${MediaQuery.MEDIUM} {
    grid-template-columns: ${repeatItemCSS(2)};
    font-size: small;
    width: ${WidthSize.MEDIUM};
  }
  ${MediaQuery.LARGE} {
    grid-template-columns: ${repeatItemCSS(3)};
    font-size: small;
    width: ${WidthSize.LARGE};
  }
  grid-template-rows: repeat(auto-fill, 1fr);
  font-size: small;
  max-height: 10vh;
  overflow: auto;
`;

const MoveHistory = () => {
  const positions = useSelector(state => state.positions, isEqual);

  const positionComponents = positions.map((position, index) => (
    <Move
      key={index}
      moveId={position.id}
      fan={position.fan}
      fen={position.fen}
    />
  ));
  const fullMoves = chunk(tail(positionComponents), 2).map(
    ([redMove, blackMove], index) => (
      <FullMove key={index} ordering={index + 1}>
        {redMove}
        {blackMove}
      </FullMove>
    ),
  );

  return (
    <Segment clearing tertiary>
      <Wrapper className="MoveHistory">{fullMoves}</Wrapper>
    </Segment>
  );
};

export default MoveHistory;
