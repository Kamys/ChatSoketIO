import React, { useCallback, useMemo } from 'react'
import { useStore } from 'effector-react'
import { Header } from 'semantic-ui-react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import { Item, Items } from '../components/Items/Items'
import { useDidMount } from '../hooks'
import user from '../store/user'
import { useSelectedUser } from 'client/hooks/user'
import { IUser } from 'client/store/user/user'

const Title = styled.h3`
  &&& {
    padding-top: 10px;
    padding-left: 10px;
  }
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

  return (
    <>
      <Header as={Title}>List user</Header>
      <Items items={items} onChange={handleSelectUser} value={selectedUser?.id} />
    </>
  )
}

export default ListUser
