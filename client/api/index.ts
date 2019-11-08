import axios from 'axios'
import { getToken, setToken } from './utils'

const savedToken = getToken()

export const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3000/api/',
  headers: {
    ...(savedToken && { Authorization: `Bearer ${savedToken}` }),
  },
})

export const initToken = (token: string) => {
  if (token) {
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`
  } else {
    delete axiosInstance.defaults.headers['Authorization']
  }
  setToken(token)
}
