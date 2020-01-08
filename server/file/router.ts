import express from 'express'
import { RequestQuery } from 'server/type'
import Utils from 'server/file/utils'
import { DomainError } from 'server/domainError'
import { HTTP_STATUS } from 'server/domainError/types'

const router = express.Router()

type GetFileQuery = {
  fileName: string
}

const handlerGetFile = async (req: RequestQuery<GetFileQuery>, res, next) => {
  const { fileName } = req.query
  const errorHandle = error => {
    if (error && error.status == HTTP_STATUS.NOT_FOUND) {
      const domainError = DomainError.notFound({
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

router.get('/', handlerGetFile)

export default router
