import { useEffect } from 'react'

export const useDidMount = (callback: () => void) => {
  useEffect(callback, [])
}
