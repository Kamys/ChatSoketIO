import path from 'path'
import { FILES_DIR } from './constants'

const getFilePath = (fileName: string) => {
  const filePath = path.join(FILES_DIR, fileName)
  return path.resolve(filePath)
}

export default { getFilePath }
