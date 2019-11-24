import React, { useCallback } from 'react'
import { useStore } from 'effector-react'
import { useParams } from 'react-router'
import { useDidMount } from '../hooks'
import Chat from '../store/chats'
import User from '../store/user'
import { getChatByMember } from '../store/chats/utils'
import { Button } from 'semantic-ui-react'

type Props = {}

export const RightPanel: React.FC<Props> = () => {
  const { chatId } = useParams<{ chatId: string }>()
  const storeChats = useStore(Chat.storeChats)
  const storeAccount = useStore(User.storeAccount)
  console.log('storeChats: ', storeChats)
  const privateChat = getChatByMember(storeChats, [ storeAccount.id, chatId ])

  useDidMount(() => {
    Chat.getAll()
  })

  const onCreateChat = useCallback(() => {
    Chat.createChat({ memberId: chatId })
  }, [chatId])

  if  (!privateChat) {
    return (
      <Button onClick={onCreateChat}>Создать чат</Button>
    )
  }

  return (
    <div>Чат активен</div>
  )
}
