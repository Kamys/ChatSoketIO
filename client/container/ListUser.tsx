import React, { useCallback, useMemo } from 'react'
import { useStore } from 'effector-react'
import { Header } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import { Item, Items } from '../components/Items/Items'
import { useDidMount } from '../hooks'
import user from '../store/user'

type Props = {}

export const ListUser: React.FC<Props> = () => {
  const listUser = useStore(user.storeList)
  useDidMount(() => {
    user.getAll()
  })
  const history = useHistory()

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
      history.push(`/${selectedUser.name}`)
    },
    [history, listUser]
  )

  return (
    <>
      <Header as="h2">List user</Header>
      <Items items={items} onSelect={handleSelectUser} />
    </>
  )
}
