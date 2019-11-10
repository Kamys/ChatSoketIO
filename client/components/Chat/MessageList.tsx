import React from 'react'
import { Comment, Header } from 'semantic-ui-react'
import styled from 'styled-components'
import { ChatItem } from './type'

const CommentStyled = styled.div`
  width: 100%;
`

const Comments = styled.div`
  height: 500px;
  overflow: auto;
`

type Props = {
  chatItems: ChatItem[]
}

const MessageList: React.FC<Props> = ({ chatItems }) => {
  return (
    <Comment.Group as={CommentStyled}>
      <Header as="h3" dividing>
        Main chat
      </Header>
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
