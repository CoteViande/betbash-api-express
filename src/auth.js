import request from 'request'

import User from './models/user/user.schema'
import logger from './utils/logger'
import { UserAlreadyExistsError, InvalidCredentialsError } from './utils/errors'
import outputFormat from './utils/outputFormat'
import { lookup } from './utils/parseRequest'

export const register = (req, res, next) => {
  const email = lookup(req, 'email', true)
  const password = lookup(req, 'password', true)

  User.findOne({ email: email }, (err, exists) => {
    if (err) return next(err)
    if (!!exists) return next(new UserAlreadyExistsError())

    const user = new User()
    user.email = email
    user.setPassword(password)

    user.save(err => {
      if (err) return next(err)

      const token = user.generateJWToken()
      res.json(outputFormat({
        id: user._id,
        token,
      }))
    })
  })
}

export const login = (req, res, next) => {
  const email = lookup(req, 'email', true)
  const password = lookup(req, 'password', true)

  User.findOne({ email: email }, (err, user) => {
    if (err) return next(err)
    if (!user) return next(new InvalidCredentialsError())
    if (!user.isPasswordValid(password)) return next(new InvalidCredentialsError())

    const token = user.generateJWToken()
    res.json(outputFormat({
      id: user._id,
      token,
    }))
  })
}

export const facebookSignIn = (req, res, next) => {
  const FBAccessToken = lookup(req, 'FBAccessToken', true)

  const profileURL = 'https://graph.facebook.com/v2.8/me'
  const fields = 'id,email,picture,first_name,last_name,middle_name,link,gender'

  const options = {
    method: 'GET',
    url: profileURL,
    qs: {
      access_token: FBAccessToken,
      fields: fields,
    },
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
    },
    json: true,
  }

  request(options, (error, response, body) => {
    if (error) throw new Error(error)

    logger.debug(body)
    res.json(outputFormat(body))
  })
}