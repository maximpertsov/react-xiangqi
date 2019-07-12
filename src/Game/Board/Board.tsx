/** @jsx jsx */ jsx

import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import Square from '../Square/Square'
import { css, jsx } from '@emotion/core'
import { getPiece } from '../Piece/Piece'
import { boardPropType } from '../../logic'

import boardImg from './board-1000px.svg.png'

// TODO find a better name
type XBoard = any
// TODO move to central location
type Slot = number | 

interface BoardProps {
  board: XBoard
  handleLegalMove: (board: XBoard, fromSlot: number, toSlot: number) => void
  handleSelect: (params: { slot: number }) => void
  legalMoves: number[][]
  nextMoveColor: number
  reversed: boolean
  selectedSlot?: number | null
}

const Board = ({
  board,
  handleLegalMove,
  handleSelect,
  legalMoves,
  nextMoveColor,
  reversed,
  selectedSlot = null,
}: BoardProps) => {
  const getPieceOn = (slot: number) => getPiece(board.getPiece(slot))

  const selectedCanCapture = (slot: number) => {
    if (selectedSlot === null) return false
    if (!board.isOccupied(selectedSlot)) return false
    if (!board.isOccupied(slot)) return false
    return !board.sameColor(slot, selectedSlot)
  }

  const isLegalMove = (fromSlot: number, toSlot: number) =>
    legalMoves[fromSlot].includes(toSlot)

  const handleMove = (fromSlot: number, toSlot: number) => {
    if (isLegalMove(fromSlot, toSlot)) handleLegalMove(board, fromSlot, toSlot)
    handleSelect({ slot: null })
  }

  const handleSquareClick = ({ slot: number, isOccupied: boolean }) => {
    if (slot === selectedSlot) {
      handleSelect({ slot: null })
    } else if (isOccupied && !selectedCanCapture(slot)) {
      handleSelect({ slot })
    } else if (selectedSlot !== null) {
      handleMove(selectedSlot, slot)
    } else {
      handleSelect({ slot: null })
    }
  }

  const getTargets = () =>
    selectedSlot === null ? [] : legalMoves[selectedSlot]

  const getInCheckSlot = () => {
    if (!board.kingInCheck(nextMoveColor)) return undefined
    return board.findKingSlot(nextMoveColor)
  }

  const getSlot = (b, i) => (reversed ? b.length - i - 1 : i)

  const renderSquares = () =>
    board.board.map((_, i, b) => {
      const slot = getSlot(b, i)
      return (
        <Square
          key={slot}
          slot={slot}
          piece={getPieceOn(slot)}
          inCheckSlot={getInCheckSlot()}
          targets={getTargets()}
          handleSquareClick={handleSquareClick}
          selected={selectedSlot === slot}
        />
      )
    })

  return (
    <div
      className="Board"
      css={css`
        background-image: url(${boardImg});
        background-size: contain;
        background-repeat: no-repeat;
        background-position: top;
        display: grid;
        grid-template-rows: repeat(10, 60px);
        grid-template-columns: repeat(9, 60px);
        justify-content: center;
      `}
    >
      {renderSquares()}
    </div>
  )
}
export default Board
