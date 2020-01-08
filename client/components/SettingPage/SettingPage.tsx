import * as React from 'react'
import styled from 'styled-components'
import { Button, Image } from 'semantic-ui-react'
import DefaultImage from './defaultImage.jpg'
import { getFileUrl } from 'client/utils'
import User from 'client/store/user'
import { useEffect, useMemo } from 'react'
import { useAccount } from 'client/hooks/user'
import { useInputFile } from 'client/hooks'

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

  const { account } = useAccount()
  const { inputFileRef, handleOpenInputFile, file, base64 } = useInputFile()

  useEffect(() => {
    if (file) {
      User.saveAvatar({ avatar: file })
    }
  }, [file])

  const imageSrc = useMemo(() => {
    if (base64) {
      return base64
    }
    if (account.avatar) {
      return getFileUrl(account.avatar)
    }

    return DefaultImage
  }, [account.avatar, base64])
  
  return (
    <div>
      <Image src={imageSrc} size='small' />
      <Button onClick={handleOpenInputFile}>Select image</Button>
      <HiddenInput
        ref={inputFileRef}
        type="file"
        accept={ALLOWED_EXTENSION.join(',')}
      />
    </div>
  )
}

export default SettingPage
