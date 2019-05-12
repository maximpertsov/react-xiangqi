import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Piece, sourcePropType } from '../Piece/Piece';

const Wrapper = styled.div(
  {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    display: 'flex',
    justifyContent: 'center',
  },
  ({ selected }) => ({
    backgroundColor: (selected ? 'rgba(152, 251, 152, 0.3)' : 'none'),
  }),
);

class Square extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      selected: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      row, col, selectedRow, selectedCol,
    } = nextProps;

    if (this.isOccupied() && row === selectedRow && col === selectedCol) {
      this.setState((prevState) => ({ selected: !prevState.selected }));
    } else {
      this.setState({ selected: false });
    }
  }

  getPiece() {
    if (!this.isOccupied()) return undefined;
    const { pieceData } = this.props;
    const { icon, color, type } = pieceData;
    return (<Piece icon={icon} color={color} type={type} />);
  }

  handleClick() {
    const {
      row, col, selectedRow, selectedCol, handleMove, handleSelect,
    } = this.props;
    const { selected } = this.state;
    if (this.isOccupied() && selected) handleSelect(null, null);
    else if (this.isOccupied()) handleSelect(row, col);
    else if (this.anySelected()) handleMove(selectedRow, selectedCol, row, col);
    else handleSelect(null, null);
  }

  isOccupied() {
    const { pieceData } = this.props;
    return pieceData !== undefined;
  }

  anySelected() {
    const { selectedRow, selectedCol } = this.props;
    return selectedRow !== null && selectedCol !== null;
  }

  render() {
    const { selected } = this.state;

    return (
      <Wrapper
        className="Square"
        onClick={this.handleClick}
        selected={selected}
      >
        {this.getPiece()}
      </Wrapper>
    );
  }
}

Square.propTypes = {
  col: PropTypes.number.isRequired,
  handleMove: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  pieceData: PropTypes.shape({
    color: PropTypes.string,
    icon: sourcePropType,
    type: PropTypes.string,
  }),
  row: PropTypes.number.isRequired,
  selectedCol: PropTypes.number,
  selectedRow: PropTypes.number,
};

Square.defaultProps = {
  pieceData: undefined,
  selectedCol: null,
  selectedRow: null,
};

export default Square;
