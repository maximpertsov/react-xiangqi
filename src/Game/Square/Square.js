import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const SELECTION_GREEN = 'rgba(30, 179, 0, 0.3)';
const IN_CHECK_RED = 'red';

const Wrapper = styled.div(
  {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    display: 'flex',
    justifyContent: 'center',
    padding: '0px;',
    margin: '0px;',
  },
  ({ inCheck, selected, targeted }) => {
    let outline;
    if (targeted) {
      outline = `2px dotted ${SELECTION_GREEN}`;
    } else if (inCheck) {
      outline = `2px dotted ${IN_CHECK_RED}`;
    } else {
      outline = 'none';
    }
    return {
      backgroundColor: (selected ? SELECTION_GREEN : 'none'),
      outline,
      outlineOffset: (targeted ? '-2px' : 'none'),
    };
  },
);

const Dot = styled.div`
  width:50%;
  height:50%;
  position:relative;
  top:50%;
  transform:translateY(-50%);
  border-radius:50%;
  background:${SELECTION_GREEN};
`;

const Square = ({
  handleSquareClick,
  piece,
  slot,
  selected,
  inCheckSlot,
  targets,
}) => {
  const isOccupied = () => piece !== undefined;

  const clickWillUnselect = () => isOccupied() && selected;

  const renderSquareElement = () => {
    if (isOccupied()) return piece;
    if (targets.includes(slot)) return (<Dot />);
    return (<div />);
  };

  const isTargeted = () => isOccupied() && targets.includes(slot);

  const inCheck = () => slot === inCheckSlot;

  const handleClick = () => {
    handleSquareClick({
      slot,
      isOccupied: isOccupied(),
      clickWillUnselect: clickWillUnselect(),
    });
  };

  return (
    <Wrapper
      className="Square"
      onClick={handleClick}
      selected={selected}
      targeted={isTargeted()}
      inCheck={inCheck()}
    >
      {renderSquareElement()}
    </Wrapper>
  );
};

Square.propTypes = {
  handleSquareClick: PropTypes.func.isRequired,
  piece: PropTypes.element,
  slot: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  inCheckSlot: PropTypes.number,
  targets: PropTypes.arrayOf(PropTypes.number).isRequired,
};

Square.defaultProps = {
  piece: undefined,
  inCheckSlot: null,
};

export default Square;
