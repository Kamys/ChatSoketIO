import React from 'react'

import styled from 'styled-components'

import Menu from '../../container/ListUser'

type Props = {}

const Container = styled.div`
    display: grid;
    grid-template-areas:
            'leftPanel MainContent';
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 5fr;
    grid-gap: 10px;
    height: 100vh;
`

const LeftPanel = styled.div`
  grid-area: leftPanel;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
`

const MainContent = styled.div`
  grid-area: MainContent;
`

export const MainPage: React.FC<Props> = ({ children }) => {
  return (
    <Container>
      <LeftPanel>
        <Menu />
      </LeftPanel>
      <MainContent>{children}</MainContent>
    </Container>
  )
}
