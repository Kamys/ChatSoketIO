import React from 'react'
import { Comment } from 'semantic-ui-react'
import styled from 'styled-components'
import { ChatItem } from './type'

const Comments = styled.div`

`

type Props = {
  as: React.ReactNode
  chatItems: ChatItem[]
}

const MessageList: React.FC<Props> = ({ chatItems, as }) => {
  return (
    <Comment.Group as={as}>
      <Comments>
        {chatItems.map(chatItem => (
          <React.Fragment key={chatItem.id}>
            {chatItem.reactNode}
          </React.Fragment>
        ))}
      </Comments>
    </Comment.Group>
  )
}

export default React.memo(MessageList)
