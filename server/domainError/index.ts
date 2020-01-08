import {
  DomainErrorType,
  ForbiddenErrorProps,
  HTTP_STATUS,
  InvalidArgsErrorProps,
  InvalidObjectIdProps,
  NotFoundEntityProps,
  NotFoundProps,
} from 'server/domainError/types'

export class DomainError extends Error {
  domainErrorType: DomainErrorType
  errorInfo: Object
  httpStatus: HTTP_STATUS = HTTP_STATUS.SERVER_ERROR

  constructor(type: DomainErrorType, errorInfo: object) {
    super(`${type}. ${JSON.stringify(errorInfo)}`)
    this.domainErrorType = type
    this.errorInfo = errorInfo

    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  setHttpStatus = (httpStatus: HTTP_STATUS) => {
    this.httpStatus = httpStatus
    return this
  }

  static invalidArgs = (errorInfo: InvalidArgsErrorProps) => {
    return new DomainError(DomainErrorType.InvalidArgs, errorInfo)
  }

  static notFound = (errorInfo: NotFoundProps) => {
    return new DomainError(DomainErrorType.NotFound, errorInfo)
      .setHttpStatus(HTTP_STATUS.NOT_FOUND)
  }

  static forbidden = (errorInfo: ForbiddenErrorProps) => {
    return new DomainError(DomainErrorType.Forbidden, errorInfo)
      .setHttpStatus(HTTP_STATUS.FORBIDDEN)
  }

  static invalidObjectId = (errorInfo: InvalidObjectIdProps) => {
    return DomainError.invalidArgs({
      argumentName: errorInfo.argumentName,
      validationMessages: 'This an invalid ObjectId',
    })
  }

  static notFoundEntity = (errorInfo: NotFoundEntityProps) => {
    return DomainError.notFound({
      searchParams: errorInfo.searchParams,
      whatNotFound: `Entity ${errorInfo.entityName}`,
    })
      .setHttpStatus(HTTP_STATUS.NOT_FOUND)
  }
}
