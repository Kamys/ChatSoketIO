import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { ContainerChat } from '~/container/ContainerChat'
import { MainPage } from '../MainPage/MainPage'
import SettingPage from '../SettingPage'

import { ROUT_URL } from './constants'
type Props = {}

const PrivateRouter: React.FC<Props> = () => {
  return (
    <Switch>
      <Route exact path={ROUT_URL.Home}>
        <MainPage />
      </Route>
      <Route exact path={ROUT_URL.Setting}>
        <MainPage>
          <SettingPage />
        </MainPage>
      </Route>
      <Route exact path={ROUT_URL.Chat}>
        <MainPage>
          <ContainerChat />
        </MainPage>
      </Route>
    </Switch>
  )
}

export default PrivateRouter
