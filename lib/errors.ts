export enum ErrorName {
  SERVER_ERROR = 'SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export class BaseError extends Error {
  public name: ErrorName
  public status: number

  constructor(name: ErrorName, message: string, status: number) {
    super(message)
    this.name = name
    this.status = status
  }
}

export class ServerError extends BaseError {
  constructor(message: string) {
    super(ErrorName.SERVER_ERROR, message, 500)
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(ErrorName.NOT_FOUND, message, 404)
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super(ErrorName.UNAUTHORIZED, message, 401)
  }
}
