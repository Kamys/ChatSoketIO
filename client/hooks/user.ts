import { useMemo, useEffect, useState, useCallback } from 'react'
import { useStore } from 'effector-react'
import isNil from 'lodash/isNil'
import { useParams } from 'react-router-dom'
import { IUser } from '../store/user/user'
import user from '../store/user'
import { hasToken } from '../api/utils'

type UseUserResult = {
  isLogin: boolean
  isLoading: boolean
  account: IUser
}

export const useAccount = (): UseUserResult => {
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

export const useSelectedUser = (): IUser | null => {
  const listUser = useStore(user.storeList)
  const { chatId } = useParams<{ chatId: string }>()

  return useMemo(() => {
    return listUser.find(item => item.id === chatId)
  }, [chatId, listUser])
}

export const useGetAvatar = () => {
  const listUser = useStore(user.storeList)
  const { account } = useAccount()
  
  return useCallback((userId: string) => {
    if (account.id === userId) {
      return account.avatar
    }
    const user = listUser.find(user => user.id === userId)
    return user && user.avatar
  }, [account.avatar, account.id, listUser])
}
