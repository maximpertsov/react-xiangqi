/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import PropTypes from 'prop-types';

const GameInfo = ({ activePlayer, hasLegalMoves, userColor }) => {
  const userIsActive = () => {
    const { color } = activePlayer;
    return color === userColor;
  };

  const loadingUser = () => userColor === undefined;

  const getMessage = () => {
    if (loadingUser()) {
      const { color } = activePlayer;
      return `${color}'s turn`;
    }
    if (!hasLegalMoves) {
      // TODO: specify if won by stalemate or checkmate
      return userIsActive() ? 'You lose!' : 'You win!';
    }
    return userIsActive() ? 'Your turn' : 'Waiting for opponent';
  };

  return (
    <div
      className="GameInfo"
      css={css`
        color: #999;
      `}
    >
      <p>{ getMessage() }</p>
    </div>
  );
};

GameInfo.propTypes = {
  activePlayer: PropTypes.shape({
    color: PropTypes.string.isRequired,
    name: PropTypes.string,
  }),
  hasLegalMoves: PropTypes.bool.isRequired,
  userColor: PropTypes.string,
};

GameInfo.defaultProps = {
  activePlayer: undefined,
  userColor: undefined,
};

export default GameInfo;
