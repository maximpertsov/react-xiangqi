/** @jsx jsx */ jsx

import React from 'react'
import { css, jsx } from '@emotion/core'
import * as images from './images'
import { Color } from '../../types'

type PieceCode =
  | 'k'
  | 'a'
  | 'e'
  | 'h'
  | 'r'
  | 'c'
  | 'p'
  | 'K'
  | 'A'
  | 'E'
  | 'H'
  | 'R'
  | 'C'
  | 'P'

type PieceType =
  | 'general'
  | 'advisor'
  | 'elephant'
  | 'horse'
  | 'chariot'
  | 'cannon'
  | 'soldier'

interface PieceProps {
  color: Color
  type: PieceType
  icon: string
}

export const Piece = ({ color, type, icon }: PieceProps) => {
  const alt = `${color} ${type}`

  return (
    <img
      className="Piece"
      css={css`
        pointer-events: none;
        user-select: none;
        -moz-user-select: none;
        max-height: 80%;
        max-width: 80%;
        display: block;
        margin: auto;
      `}
      alt={alt}
      src={icon}
    />
  )
}

const pieceType = {
  k: <Piece icon={images.blackGeneral} color="black" type="general" />,
  a: <Piece icon={images.blackAdvisor} color="black" type="advisor" />,
  e: <Piece icon={images.blackElephant} color="black" type="elephant" />,
  h: <Piece icon={images.blackHorse} color="black" type="horse" />,
  r: <Piece icon={images.blackChariot} color="black" type="chariot" />,
  c: <Piece icon={images.blackCannon} color="black" type="cannon" />,
  p: <Piece icon={images.blackSoldier} color="black" type="soldier" />,
  K: <Piece icon={images.redGeneral} color="red" type="general" />,
  A: <Piece icon={images.redAdvisor} color="red" type="advisor" />,
  E: <Piece icon={images.redElephant} color="red" type="elephant" />,
  H: <Piece icon={images.redHorse} color="red" type="horse" />,
  R: <Piece icon={images.redChariot} color="red" type="chariot" />,
  C: <Piece icon={images.redCannon} color="red" type="cannon" />,
  P: <Piece icon={images.redSoldier} color="red" type="soldier" />,
}

export const getPiece = (code: PieceCode) => pieceType[code]
