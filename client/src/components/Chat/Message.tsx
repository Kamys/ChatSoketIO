import * as React from 'react'

import { Comment } from 'semantic-ui-react'
import styled from 'styled-components'
import { Avatar } from '~/components/Avatar'

import { ChatMessage } from './type'

const CommentDiv = styled.div`
  &&& {
    display: flex;
    align-items: center;
  }
`

const Content = styled.div`
  &&& {
    margin-left: 10px;
  }
`

type Props = ChatMessage & {
  isYour?: boolean
}

const Message: React.FC<Props> = props => {
  const { userAvatar, name, dataCreated, text } = props
  return (
    <Comment as={CommentDiv}>
      <Avatar imageSrc={userAvatar} />
      <Comment.Content as={Content}>
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
