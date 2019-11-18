import React, { useCallback } from 'react'
import { List } from 'semantic-ui-react'
import styled from 'styled-components'

const Item = styled.div`
  &&&& {
    padding: 10px;
    :hover {
      background-color: rgba(0, 255, 255, 0.03);
    }
  }
`

export type Item = {
  id: string
  imageSrc?: string
  title: string
  text: string
}

type Props = {
  items: Item[]
  onSelect?: (id: string) => void
}

export const Items: React.FC<Props> = ({ items, onSelect }) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      const id = event.currentTarget.id
      onSelect && onSelect(id)
    },
    [onSelect]
  )

  return (
    <List divided relaxed>
      {items.map(item => (
        <List.Item onClick={handleClick} as={Item} id={item.id} key={item.id}>
          <List.Icon name="user" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header as="a">{item.title}</List.Header>
            <List.Description as="a">{item.text}</List.Description>
          </List.Content>
        </List.Item>
      ))}
    </List>
  )
}
