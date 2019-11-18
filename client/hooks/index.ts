import { useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import isNil from 'lodash/isNil'
import user from '../store/user'
import { hasToken } from '../api/utils'
import { IUser } from '../store/user/user'

type UseUserResult = {
  isLogin: boolean
  isLoading: boolean
  account: IUser
}

export const useUser = (): UseUserResult => {
  const account = useStore(user.storeAccount)
  const [isLoading, setIsLoading] = useState(true)
  const isLogin = !isNil(account) && hasToken()

  useEffect(() => {
    if (hasToken()) {
      user.fetchAccount().finally(() => {
        setIsLoading(false)
      })
    } else {
      setIsLoading(false)
    }
  }, [])

  return {
    account,
    isLogin,
    isLoading,
  }
}

export const useDidMount = (callback: () => void) => {
  useEffect(callback, [])
}
