import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import RedirectConditional from './RedirectConditional'
import { ROUT_URL } from './constants'
import Auth from '../Auth'
import { useUser } from '../../hooks'
import { Private } from './Private'
import Chat from '../Chat/Chat'

const PageContained = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

type Props = {}

const MainRouter: React.FC<Props> = () => {
  const { isLoading, isLogin } = useUser()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter>
      <PageContained>
        <Switch>
          <Route path={ROUT_URL.Login}>
            <RedirectConditional isRedirect={isLogin} to={ROUT_URL.Home}>
              <Auth />
            </RedirectConditional>
          </Route>
          <Private path={ROUT_URL.Home}>
            <Chat />
          </Private>
          <Route>404</Route>
        </Switch>
      </PageContained>
    </BrowserRouter>
  )
}

export default MainRouter
