import React from 'react'
import { Route } from 'react-router'

import { useAccount } from '~/hooks/user'

import { ROUT_URL } from './constants'
import RedirectConditional from './RedirectConditional'

type Props = {
  path: ROUT_URL
}

export const Private: React.FC<Props> = props => {
  const { path, children } = props
  const { isLogin } = useAccount()

  return (
    <Route path={path}>
      <RedirectConditional isRedirect={!isLogin} to={ROUT_URL.Login}>
        {children}
      </RedirectConditional>
    </Route>
  )
}
