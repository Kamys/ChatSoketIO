import React from 'react'
import styled from 'styled-components'
import ListUser from '../../container/ListUser'

type Props = {}

const Container = styled.div`
  padding: 10px;
  display: flex;
`

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

const MainContent = styled.div`
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  flex-grow: 5;
`

export const MainPage: React.FC<Props> = ({ children }) => {
  return (
    <Container>
      <LeftPanel>
        <ListUser />
      </LeftPanel>
      <MainContent>{children}</MainContent>
    </Container>
  )
}
