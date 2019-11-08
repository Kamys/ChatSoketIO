import React from 'react'
import { Redirect, Route } from 'react-router-dom'

interface IProps {
  children: any
  isRedirect: boolean
  to: string
}

const RedirectConditional: React.FC<IProps> = props => {
  const { isRedirect, to, children, ...rest } = props

  if (isRedirect) {
    return (
      <Route
        {...rest}
        render={history => (
          <Redirect
            to={{
              pathname: to,
              state: { from: history.location },
            }}
          />
        )}
      />
    )
  }

  return children
}

export default RedirectConditional
