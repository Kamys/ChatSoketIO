import uniqid from 'uniqid'
import Utils from './utils'

const saveFile = async (file: any): Promise<string> => {
  const filename = uniqid()
  const fiePath = Utils.getFilePath(filename)

  return new Promise((resolve, reject) => {
    file.mv(fiePath, err => {
      if (err) {
        reject(err)
      }
      resolve(filename)
    })
  })
}

export default { saveFile }
