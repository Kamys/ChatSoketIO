import React, { useCallback } from 'react'

import { List } from 'semantic-ui-react'
import styled from 'styled-components'

import { Avatar } from '../Avatar'

const Item = styled.div`
  &&&& {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;
    :hover {
      background-color: rgba(0, 255, 255, 0.03);
    }
  }
`

const Name = styled.a`
  &&&& {
    margin-left: 10px;
  }
`

const ItemActive = styled(Item)`
  &&&& {
    background-color: lightskyblue;
    :hover {
      background-color: lightskyblue;
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
  onChange?: (id: string) => void
  value: string
}

export const Items: React.FC<Props> = ({ items, onChange, value }) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      const id = event.currentTarget.id
      onChange && onChange(id)
    },
    [onChange]
  )

  return (
    <List divided relaxed>
      {items.map(item => (
        <List.Item
          onClick={handleClick}
          as={item.id === value ? ItemActive : Item}
          id={item.id}
          key={item.id}
        >
          <Avatar imageSrc={item.imageSrc} />
          <List.Header as={Name}>{item.title}</List.Header>
        </List.Item>
      ))}
    </List>
  )
}
