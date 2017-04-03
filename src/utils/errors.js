import logger from './logger'

const errorsJSON = {
  BAD_REQUEST: {
    status: 400,
    code: 'BAD_REQUEST',
    title: 'Bad request',
    message: 'The request is not valid.',
  },
  UNAUTHORIZED: {
    status: 401,
    code: 'UNAUTHORIZED',
    title: 'Unauthorized access',
    message: 'You are not allowed to access this data.',
  },
  USER_ALREADY_EXISTS: {
    status: 401,
    code: 'USER_ALREADY_EXISTS',
    title: 'User already exists',
    message: 'You are already registered.',
  },
  INVALID_CREDENTIALS: {
    status: 401,
    code: 'INVALID_CREDENTIALS',
    title: 'Invalid credentials',
    message: 'The credentials are not valid.',
  },
}

const NewErrorType = name => (function(message) {
  this.constructor.prototype.__proto__ = Error.prototype
  Error.captureStackTrace(this, this.constructor)
  this.name = name
  this.message = message
})

export const UnauthorizedError = NewErrorType('UNAUTHORIZED')
export const BadRequestError = NewErrorType('BAD_REQUEST')
export const InvalidCredentialsError = NewErrorType('INVALID_CREDENTIALS')
export const UserAlreadyExistsError = NewErrorType('USER_ALREADY_EXISTS')

const errorToJson = err => ({
  error: true,
  payload: {
    status: err.status,
    code: err.code,
    title: err.title,
    message: err.message,
  },
})

const errorsToJsonResponses = errors => {
  const responses = Object.keys(errors).reduce((response, current) => {
    response[current] = errorToJson(errors[current])
    return response
  }, {})
  return responses
}

const errorResponses = errorsToJsonResponses(errorsJSON)

export const errorHandler = (err, req, res, next) => {
  logger.error(err)
  switch (err.name) {
    case 'BAD_REQUEST':
    case 'ValidationError':
      res.status(400).json(errorResponses.BAD_REQUEST)
      break
    case 'UNAUTHORIZED':
      res.status(400).json(errorResponses.UNAUTHORIZED)
      break
    case 'INVALID_CREDENTIALS':
      res.status(401).json(errorResponses.INVALID_CREDENTIALS)
      break
    case 'USER_ALREADY_EXISTS':
      res.status(401).json(errorResponses.USER_ALREADY_EXISTS)
      break
    default:
      logger.error('Unhandled error: ', err.name)
      break
  }
}