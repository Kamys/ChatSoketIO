import React, { useEffect, useState } from 'react'
import isNil from 'lodash/isNil'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import styled from 'styled-components'
import { useStore } from 'effector-react'
import user, { IUser } from '../../store/user'
import RedirectConditional from './RedirectConditional'
import { ROUT_URL } from './constants'
import Auth from '../Auth'

const PageContained = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

interface IProps {}

type UseUserResult = {
  isLogin: boolean
  isLoading: boolean
  account: IUser
}

const useUser = (): UseUserResult => {
  const account = useStore(user.account)
  const [isLoading, setIsLoading] = useState(true)
  const isLogin = !isNil(account)

  useEffect(() => {
    user.fetchAccount().finally(() => {
      setIsLoading(false)
    })
  }, [])

  console.log('Render useUser', {
    account,
    isLogin,
    isLoading,
  })
  return {
    account,
    isLogin,
    isLoading,
  }
}

const MainRouter: React.FC<IProps> = () => {
  const { isLoading, isLogin, account } = useUser()

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
          <Route path={ROUT_URL.Home}>
            <RedirectConditional isRedirect={!isLogin} to={ROUT_URL.Login}>
              User name: {JSON.stringify(account)}
            </RedirectConditional>
          </Route>
          <Route>404</Route>
        </Switch>
      </PageContained>
    </BrowserRouter>
  )
}

export default MainRouter
