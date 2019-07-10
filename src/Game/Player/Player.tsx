/** @jsx jsx */ jsx

import React from 'react'
import { jsx } from '@emotion/core'
import { Color } from '../../types'

interface PlayerProps {
  color: Color
  name: string
}

const Player = ({ name, color }: PlayerProps) => {
  const displayText = `${color === 'red' ? '帥' : '將'} ${name}`

  return <div css={{ color: color }}>{displayText}</div>
}

export default Player
