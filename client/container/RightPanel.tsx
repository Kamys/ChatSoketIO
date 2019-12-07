import React, { useEffect } from 'react'
import { useStore } from 'effector-react'
import { useParams } from 'react-router'
import Chat from '../store/chats'
import User from '../store/user'
import { getChatByMember } from '../store/chats/utils'

type Props = {}

export const RightPanel: React.FC<Props> = () => {
  const { chatId } = useParams<{ chatId: string }>()
  const storeChats = useStore(Chat.storeChats)
  const storeAccount = useStore(User.storeAccount)
  const privateChat = getChatByMember(storeChats, [ storeAccount.id, chatId ])

  useEffect(() => {
    Chat.getChat({ memberId: chatId })
  }, [chatId])

  return (
    <div>Чат активен {privateChat && privateChat.id}</div>
  )
}
