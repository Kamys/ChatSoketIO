import React, { useCallback, useMemo } from 'react'
import { useStore } from 'effector-react'
import { Header, Icon } from 'semantic-ui-react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import { Item, Items } from '~/components/Items/Items'
import { useDidMount } from '~/hooks'
import user from '~/store//user'
import { useSelectedUser } from '~/hooks/user'
import { IUser } from '~/store/user/user'
import { ROUT_URL } from '~/components/MainRouter/constants'
import { getFileUrl } from '~/utils'

const Title = styled.h3`
  &&& {
    padding-top: 10px;
    padding-left: 10px;
  }
`

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-right: 5px;
  padding-top: 5px;
`

const IconContainer = styled.div`
  cursor: pointer;
`

type Props = {}

const ListUser: React.FC<Props> = () => {
  const listUser = useStore(user.storeList)
  useDidMount(() => {
    user.getAll()
  })
  const history = useHistory()
  const selectedUser: IUser = useSelectedUser()

  const items = useMemo((): Item[] => {
    return listUser.map(user => ({
      id: user.id,
      title: user.name,
      imageSrc: getFileUrl(user.avatar),
      text: '',
    }))
  }, [listUser])

  const handleSelectUser = useCallback(
    (id: string) => {
      const selectedUser = listUser.find(user => user.id === id)
      history.push(`/${selectedUser.id}`)
    },
    [history, listUser]
  )

  const handleOpenSetting = useCallback(
    () => {
      history.push(ROUT_URL.Setting)
    },
    [history]
  )

  return (
    <>
      <HeaderContainer>
        <Header as={Title}>List user</Header>
        <IconContainer onClick={handleOpenSetting}>
          <Icon size='large' name='setting' />
        </IconContainer>
      </HeaderContainer>
      <Items items={items} onChange={handleSelectUser} value={selectedUser?.id} />
    </>
  )
}

export default ListUser
