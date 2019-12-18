import * as React from 'react'
import { Comment } from 'semantic-ui-react'
import { ChatMessage } from './type'
import styled from 'styled-components'

const Content = styled.div`
  &&& {
    background-color: rgba(0,0,0,.05);
  }
`

type Props = ChatMessage & {
  isYour?: boolean
}

const Message: React.FC<Props> = props => {
  const { userAvatar, name, dataCreated, text, isYour } = props
  return (
    <Comment as={isYour ? Content : 'div'}>
      <Comment.Avatar src={userAvatar} />
      <Comment.Content>
        <Comment.Author as="a">{name}</Comment.Author>
        <Comment.Metadata>
          <div>{dataCreated}</div>
        </Comment.Metadata>
        <Comment.Text>{text}</Comment.Text>
        <Comment.Actions>
          <Comment.Action>Reply</Comment.Action>
        </Comment.Actions>
      </Comment.Content>
    </Comment>
  )
}

export default React.memo(Message)
