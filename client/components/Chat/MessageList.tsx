import React from 'react'
import { Comment, Header } from 'semantic-ui-react'
import styled from 'styled-components'
import { ChatItem } from './type'

const CommentStyled = styled.div`
  width: 100%;
`

interface IProps {
  chatItems: ChatItem[]
}

const MessageList: React.FC<IProps> = ({ chatItems }) => {
  console.log('Render==============')
  return (
    <Comment.Group as={CommentStyled}>
      <Header as="h3" dividing>
        Main chat
      </Header>
      {chatItems.map(chatItem => {
        console.log(chatItem.id)
        return (
          <React.Fragment key={chatItem.id}>
            {chatItem.reactNode}
          </React.Fragment>
        )
      })}
    </Comment.Group>
  )
}

export default React.memo(MessageList)
