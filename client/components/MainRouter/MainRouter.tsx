import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import RedirectConditional from './RedirectConditional'
import { ROUT_URL } from './constants'
import Auth from '../Auth'
import { Private } from './Private'
import PrivateRouter from './PrivateRouter'
import { useUser } from 'client/hooks/user'

const Center = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

type Props = {}

const MainRouter: React.FC<Props> = () => {
  const { isLoading, isLogin } = useUser()

  if (isLoading) {
    return <div>Loading user...</div>
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route path={ROUT_URL.Login}>
          <RedirectConditional isRedirect={isLogin} to={ROUT_URL.Home}>
            <Center>
              <Auth />
            </Center>
          </RedirectConditional>
        </Route>
        <Private path={ROUT_URL.Home}>
          <PrivateRouter />
        </Private>
        <Route>404</Route>
      </Switch>
    </BrowserRouter>
  )
}

export default MainRouter
