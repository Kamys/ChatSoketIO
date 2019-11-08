import React from 'react'
import { ROUT_URL } from './constants'
import RedirectConditional from './RedirectConditional'
import { Route } from 'react-router'
import { useUser } from '../../hooks'

type Props = {
  path: ROUT_URL
}

export const Private: React.FC<Props> = props => {
  const { path, children } = props
  const { isLogin } = useUser()

  return (
    <Route path={path}>
      <RedirectConditional isRedirect={!isLogin} to={ROUT_URL.Login}>
        {children}
      </RedirectConditional>
    </Route>
  )
}
