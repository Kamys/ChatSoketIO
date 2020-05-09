import React from 'react'
import isEmpty from 'lodash/isEmpty'
import AvatarDefault from './SettingPage/defaultImage.jpg'
import styled from 'styled-components'

type Props = {
  imageSrc?: string
}

const AvatarImage = styled.img`
  display: inline;
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`

export const Avatar: React.FC<Props> = ({ imageSrc }) => {
/*  if (!isEmpty(imageSrc)) {
    return <AvatarImage src={imageSrc} />
  }

  return <AvatarImage src={AvatarDefault} />*/
  return null
}
