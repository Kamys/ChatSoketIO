export enum DomainErrorType {
  NotFound = 'NotFound',
  Forbidden = 'Forbidden',
  InvalidArgs = 'InvalidArguments',
}

export type InvalidArgsErrorProps = {
  validationMessages: string
  argumentName: string
}

export type InvalidObjectIdProps = {
  argumentName: string
}

export type NotFoundProps = {
  searchParams?: object
  whatNotFound: string
}

export type NotFoundEntityProps = {
  searchParams?: object
  entityName: string
}

export type ForbiddenErrorProps = {
  whoTried: string
  protectedEntityName: string
  reason: string
}
