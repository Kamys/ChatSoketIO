import {
  DomainErrorType,
  ForbiddenErrorProps,
  InvalidArgsErrorProps,
  InvalidObjectIdProps, NotFoundEntityProps,
  NotFoundProps,
} from 'server/domainError/types'

export class DomainError extends Error {
  domainErrorType: DomainErrorType
  errorInfo: Object

  constructor(type: DomainErrorType, errorInfo: object) {
    super(`${type}. ${JSON.stringify(errorInfo)}`)
    this.errorInfo = errorInfo
    this.domainErrorType = type

    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  static invalidArgs = (errorInfo: InvalidArgsErrorProps) => {
    return new DomainError(DomainErrorType.InvalidArgs, errorInfo)
  }

  static notFound = (errorInfo: NotFoundProps) => {
    return new DomainError(DomainErrorType.NotFound, errorInfo)
  }

  static forbidden = (errorInfo: ForbiddenErrorProps) => {
    return new DomainError(DomainErrorType.Forbidden, errorInfo)
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
  }
}
