import { baseURL } from 'client/src/api'

export const getFileUrl = (fileName: string): string | undefined => {
  if (fileName) {
    return `${baseURL}api/file/?fileName=${fileName}`
  }

  return undefined
}
