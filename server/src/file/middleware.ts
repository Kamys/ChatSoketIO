import { DomainErrorOld } from '~/domainError'
import { HTTP_STATUS } from '~/domainError/types'
import Utils from '~/file/utils'
import { RequestUser } from '~/type'

type GetFileQuery = {
  fileName: string
}

const handlerGetFile = async (req: RequestUser<void, GetFileQuery>, res, next) => {
  const { fileName } = req.query
  const errorHandle = error => {
    if (error && error.status == HTTP_STATUS.NOT_FOUND) {
      const domainError = DomainErrorOld.notFound({
        whatNotFound: 'File',
        searchParams: { fileName },
      })
      next(domainError)
      return
    }
    if (error) {
      next(error)
    }
  }

  try {
    const filePath = Utils.getFilePath(fileName)
    res.sendFile(filePath, errorHandle)
  } catch (e) {
    next(e)
  }
}



export default {
  handlerGetFile
}
