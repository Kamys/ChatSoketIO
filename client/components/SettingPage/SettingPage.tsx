import * as React from 'react'
import styled from 'styled-components'
import { Button, Image } from 'semantic-ui-react'
import DefaultImage from './defaultImage.jpg'
import { useInputFile } from 'client/utils'

type Props = {}

const HiddenInput = styled.input`
    position: absolute;
    left: -999px;
    visibility: hidden;
    width: 0;
    height: 0;
    opacity: 0;
`

export const ALLOWED_EXTENSION = ['image/jpeg', 'image/png']



const SettingPage: React.FC<Props> = () => {

  const { inputFile, handleOpenInputFile, file } = useInputFile(DefaultImage)

  return (
    <div>
      <Image src={file} size='small' />
      <Button onClick={handleOpenInputFile}>Select image</Button>
      <HiddenInput
        ref={inputFile}
        type="file"
        accept={ALLOWED_EXTENSION.join(',')}
      />
    </div>
  )
}

export default SettingPage
