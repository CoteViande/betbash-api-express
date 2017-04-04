import jwt from 'jsonwebtoken'
import moment from 'moment'

import * as config from './config'
import logger from './utils/logger'
import { InvalidTokenError } from './utils/errors'

const authorizationMiddleware = (req, res, next) => {
  const authorizationHeader = req.headers && (req.headers['Authorization'] || req.headers['authorization'])

  const bearerString = 'Bearer '
  if (authorizationHeader && authorizationHeader.startsWith(bearerString)) {
    const token = authorizationHeader.slice(bearerString.length)
    const tokenPayload = jwt.verify(token, config.jwt().secret)
    logger.debug(tokenPayload)

    const expirationDate = moment.unix(tokenPayload.exp)
    req.signature = {
      id: tokenPayload.data.id,
      scopes: [],
    }
  } else {
    req.signature = null
  }
  next()
}

export default authorizationMiddleware