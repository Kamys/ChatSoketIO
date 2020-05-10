import React, { useEffect } from 'react'
import { useStore } from 'effector-react'
import { useParams } from 'react-router'
import Chat from '~/store//chats'
import User from '~/store//user'
import { getChatByMember } from '~/store/chats/utils'
import ChatPersonal from './Chat'

type Props = {}

export const ContainerChat: React.FC<Props> = () => {
  const { chatId } = useParams<{ chatId: string }>()
  const storeChats = useStore(Chat.storeChats)
  const storeAccount = useStore(User.storeAccount)
  const privateChat = getChatByMember(storeChats, [ storeAccount.id, chatId ])

  useEffect(() => {
    Chat.getChat({ memberId: chatId })
  }, [chatId])

  if (!privateChat) {
    return <div>Loading...</div>
  }

  return <ChatPersonal chatId={privateChat.id} />
}
