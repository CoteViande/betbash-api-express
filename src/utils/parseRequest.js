import logger from './logger'
import { BadRequestError } from './errors'

export const lookup = (req, field, isFieldCompulsory) => {
  const value = req.body && req.body[field]
    || req.query && req.query[field]

  const isBadRequest = isFieldCompulsory && !value
  if (isBadRequest) throw new BadRequestError('BAD_REQUEST')

  return value
}