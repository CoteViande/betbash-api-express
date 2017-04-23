import jwt from 'jsonwebtoken'
import moment from 'moment'

import * as config from './config'
import logger from './utils/logger'
import { lookup } from './utils/inputFormat'
import { InvalidTokenError } from './utils/errors'
import { signInWithEmail, signInWithFacebook } from './authentication'

export const identifySignature = (req, res, next) => {
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

export const refreshToken = async (req, res, next) => {
  try {
    const attemptToRefreshToken = lookup(req, 'refreshToken', true)
    if (attemptToRefreshToken) {
      const signInMethod = lookup(req, 'signInMethod', true)
      let user
      if (signInMethod === 'facebook') {
        const FBAccessToken = lookup(req, 'FBAccessToken', true)

        user = await signInWithFacebook()
      }
      if (signInMethod === 'email') {
        const email = lookup(req, 'email', true)
        const password = lookup(req, 'password', true)

        user = await signInWithEmail(email, password)
      }
      if (user) {
        const newToken = user.generateJWToken()
        req.headers['Authorization'] = 'Bearer ' + newToken
        res.header('New-Token', JSON.stringify(newToken))
      }
    }
    next()
  } catch (error) {
    logger.warning(`Could not refresh token: ${error.name} - ${error.message}`)
    next() // silent failure
  }
}