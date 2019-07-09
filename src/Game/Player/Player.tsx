import React from 'react'
import styled from '@emotion/styled'

const Wrapper = styled.div(({ color }) => ({ color }))

interface PlayerProps {
  // TODO: make this an exported type
  color: 'red' | 'black'
  name: string
}

const Player = ({ name, color }: PlayerProps) => {
  const displayText = `${color === 'red' ? '帥' : '將'} ${name}`

  return <Wrapper color={color}>{displayText}</Wrapper>
}

export default Player
