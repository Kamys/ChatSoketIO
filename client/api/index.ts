import axios from 'axios'
import { getToken, setToken } from './utils'

const savedToken = getToken()

export const baseURL = 'http://192.168.8.100:3000/'

export const axiosInstance = axios.create({
  baseURL: `${baseURL}api/`,
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
