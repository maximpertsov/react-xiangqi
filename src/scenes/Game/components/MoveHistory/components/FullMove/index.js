import React from 'react';

import Move from '../../components/Move';

const FullMove = ({ ordering, redMove, blackMove }) =>
  (<div>
    <span>{`${ordering}. `}</span>
    <Move
      key="red"
      moveId={redMove.id}
      fromPos={redMove.fromPos}
      toPos={redMove.toPos}
      piece={redMove.piece}
    />
    {blackMove && <Move
      key="black"
      moveId={blackMove.id}
      fromPos={blackMove.fromPos}
      toPos={blackMove.toPos}
      piece={blackMove.piece}
    />}
  </div>);

// TODO: proptypes

export default FullMove;
