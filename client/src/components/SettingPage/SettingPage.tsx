import * as React from 'react'
import { useEffect, useMemo } from 'react'

import { Button, Image } from 'semantic-ui-react'
import styled from 'styled-components'
import { useInputFile } from '~/hooks'
import { useAccount } from '~/hooks/user'
import User from '~/store/user'
import { getFileUrl } from '~/utils'

import DefaultImage from './defaultImage.jpg'

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
