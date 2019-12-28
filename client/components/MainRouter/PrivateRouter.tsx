import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ROUT_URL } from './constants'
import { MainPage } from '../MainPage/MainPage'
import { ContainerChat } from '../../container/ContainerChat'
import SettingPage from '../SettingPage'
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
