import {
  DomainErrorParams,
  DomainErrorTypeOld,
  ForbiddenErrorProps,
  HTTP_STATUS,
  InvalidArgsErrorProps,
  InvalidObjectIdProps,
  NotFoundEntityProps,
  NotFoundProps,
  DomainErrorsType,
  ModelErrorParams,
} from 'server/src/domainError/types'
import { concatSentences } from '~/domainError/utils'

/**
 * @deprecated
 */
export class DomainErrorOld extends Error {
  domainErrorType: DomainErrorTypeOld
  errorInfo: Object
  httpStatus: HTTP_STATUS = HTTP_STATUS.SERVER_ERROR

  constructor(type: DomainErrorTypeOld, errorInfo: object) {
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
    return new DomainErrorOld(
      DomainErrorTypeOld.InvalidArgs,
      errorInfo
    ).setHttpStatus(HTTP_STATUS.BAD_REQUEST)
  }

  static notFound = (errorInfo: NotFoundProps) => {
    return new DomainErrorOld(
      DomainErrorTypeOld.NotFound,
      errorInfo
    ).setHttpStatus(HTTP_STATUS.NOT_FOUND)
  }

  static forbidden = (errorInfo: ForbiddenErrorProps) => {
    return new DomainErrorOld(
      DomainErrorTypeOld.Forbidden,
      errorInfo
    ).setHttpStatus(HTTP_STATUS.FORBIDDEN)
  }

  static invalidObjectId = (errorInfo: InvalidObjectIdProps) => {
    return DomainErrorOld.invalidArgs({
      argumentName: errorInfo.argumentName,
      validationMessages: 'This an invalid ObjectId',
    }).setHttpStatus(HTTP_STATUS.BAD_REQUEST)
  }

  static notFoundEntity = (errorInfo: NotFoundEntityProps) => {
    return DomainErrorOld.notFound({
      searchParams: errorInfo.searchParams,
      whatNotFound: `Entity ${errorInfo.entityName}`,
    }).setHttpStatus(HTTP_STATUS.NOT_FOUND)
  }
}

export class DomainError extends Error {
  path: string[]
  domainErrorType: DomainErrorsType
  httpStatus: HTTP_STATUS = HTTP_STATUS.SERVER_ERROR

  constructor(params: DomainErrorParams) {
    super(params.messages)
    this.path = params.path

    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  setHttpStatus = (httpStatus: HTTP_STATUS) => {
    this.httpStatus = httpStatus
    return this
  }

  setType = (domainErrorType: DomainErrorsType) => {
    this.domainErrorType = domainErrorType
    return this
  }

  static invalidArgs = (params: DomainErrorParams) => {
    return new DomainError(params)
      .setType('InvalidArguments')
      .setHttpStatus(HTTP_STATUS.BAD_REQUEST)
  }

  static notFound = (params: DomainErrorParams) => {
    return new DomainError(params)
      .setType('NotFound')
      .setHttpStatus(HTTP_STATUS.NOT_FOUND)
  }

  static forbidden = (params: DomainErrorParams) => {
    return new DomainError(params)
      .setType('Forbidden')
      .setHttpStatus(HTTP_STATUS.FORBIDDEN)
  }

  static invalidObjectId = (params: DomainErrorParams) => {
    return new DomainError(params)
      .setType('InvalidObjectId')
      .setHttpStatus(HTTP_STATUS.BAD_REQUEST)
  }

  static alreadyExist = (params: ModelErrorParams) => {
    return new DomainError({
      ...params,
      messages: concatSentences(
        `${params.modelName} already exist`,
        params.messages
      ),
    })
      .setType('ModelAlreadyExist')
      .setHttpStatus(HTTP_STATUS.BAD_REQUEST)
  }

  static notFoundModel = (params: ModelErrorParams) => {
    return new DomainError({
      ...params,
      messages: concatSentences(
        `${params.modelName} not found`,
        params.messages
      ),
    })
      .setType('ModelNotFound')
      .setHttpStatus(HTTP_STATUS.NOT_FOUND)
  }
}
