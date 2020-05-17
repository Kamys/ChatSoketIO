import express from 'express'
import { RequestUser } from 'server/type'
import Utils from 'server/file/utils'
import { DomainError } from 'server/domainError'
import { HTTP_STATUS } from 'server/domainError/types'

const router = express.Router()

type GetFileQuery = {
  fileName: string
}

const handlerGetFile = async (req: RequestUser<void, GetFileQuery>, res, next) => {
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

  const images = await Utils.getAllImageNames()
  const existImageName = images.find(imageName => imageName === fileName)

  if (!existImageName) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      path: 'fileName',
      error: 'File not found'
    })
  }

  try {
    const filePath = Utils.getFilePath(existImageName)
    res.sendFile(filePath, errorHandle)
  } catch (e) {
    next(e)
  }
}

router.get('/', handlerGetFile)

export default router
