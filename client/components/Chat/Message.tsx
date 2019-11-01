import * as React from 'react'
import { Comment } from 'semantic-ui-react'
import { ChatMessage } from './type'

const Message: React.FC<ChatMessage> = ({
  userAvatar,
  userName,
  dataCreated,
  text,
}) => (
  <Comment>
    <Comment.Avatar src={userAvatar} />
    <Comment.Content>
      <Comment.Author as="a">{userName}</Comment.Author>
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

export default React.memo(Message)
