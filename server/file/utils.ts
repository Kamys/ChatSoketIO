import path from 'path'
import fs from 'fs'
import { FILES_DIR } from './constants'

const getFilePath = (fileName: string) => {
  const filePath = path.join(FILES_DIR, fileName)
  return path.resolve(filePath)
}

const getAllImageNames = async (): Promise<string[]> => {
  return fs.readdirSync(FILES_DIR)
}

export default { getFilePath, getAllImageNames }
