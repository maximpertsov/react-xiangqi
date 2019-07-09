/** @jsx jsx */ jsx

import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { jsx } from '@emotion/core'

const SELECTION_GREEN = 'rgba(30, 179, 0, 0.3)'
const IN_CHECK_RED = 'red'

const Dot = styled.div`
  width: 50%;
  height: 50%;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  background: ${SELECTION_GREEN};
`

interface SquareProps {
  handleSquareClick: (params: { slot: number; isOccupied: boolean }) => void
  piece?: JSX.Element
  slot: number
  selected: boolean
  inCheckSlot?: number | null
  targets: number[]
}

const Square = ({
  inCheckSlot = null,
  handleSquareClick,
  piece,
  slot,
  selected,
  targets,
}: SquareProps) => {
  const isOccupied = () => piece !== undefined

  const renderSquareElement = () => {
    if (isOccupied()) return piece
    if (targets.includes(slot)) return <Dot />
    return <div />
  }

  const isTargeted = () => isOccupied() && targets.includes(slot)

  const inCheck = () => slot === inCheckSlot

  const handleClick = () => {
    handleSquareClick({ slot, isOccupied: isOccupied() })
  }

  const getOutline = () => {
    if (isTargeted()) return `2px dotted ${SELECTION_GREEN}`
    if (inCheck()) return `2px dotted ${IN_CHECK_RED}`
    return 'none'
  }

  return (
    <div
      className="Square"
      onClick={handleClick}
      css={{
        backgroundColor: selected ? SELECTION_GREEN : 'none',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        display: 'flex',
        justifyContent: 'center',
        margin: '0px;',
        outline: getOutline(),
        outlineOffset: isTargeted() ? '-2px' : 'none',
        padding: '0px;',
      }}
    >
      {renderSquareElement()}
    </div>
  )
}
export default Square
