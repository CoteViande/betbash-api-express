import request from 'request'
import crypto from 'crypto'

import User from './models/user/user.schema'
import * as config from './config'
import { lookup } from './utils/inputFormat'
import outputFormat from './utils/outputFormat'
import { UserAlreadyExistsError, InvalidCredentialsError } from './utils/errors'
import logger from './utils/logger'

const getUserWithToken = user => {
  const token = user.generateJWToken()
  return ({
    id: user._id,
    token,
  })
}

export const register = (req, res, next) => {
  const email = lookup(req, 'email', true)
  const password = lookup(req, 'password', true)

  User.findOne({ 'password.email': email }, (err, exists) => {
    if (err) return next(err)
    if (!!exists) return next(new UserAlreadyExistsError())

    const user = new User()
    user.email = email
    user.password.email = email
    user.setPassword(password)

    user.save(err => {
      if (err) return next(err)

      res.json(outputFormat(getUserWithToken(user)))
    })
  })
}

export const login = (req, res, next) => {
  const email = lookup(req, 'email', true)
  const password = lookup(req, 'password', true)

  User.findOne({ 'password.email': email }, (err, user) => {
    if (err) return next(err)
    if (!user) return next(new InvalidCredentialsError())
    if (!user.isPasswordValid(password)) return next(new InvalidCredentialsError())

    res.json(outputFormat(getUserWithToken(user)))
  })
}

export const facebookSignIn = (req, res, next) => {
  const FBAccessToken = lookup(req, 'FBAccessToken', true)

  const graphVersion = 'v2.8'
  const profileURL = `https://graph.facebook.com/${graphVersion}/me`
  const fields = 'id,email,picture.type(large),first_name,last_name,middle_name,link,gender'
  const FBAppSecret = config.facebook().secret
  const FBProofToken = crypto.createHmac('sha256', FBAppSecret).update(FBAccessToken).digest('hex')

  const options = {
    method: 'GET',
    url: profileURL,
    qs: {
      access_token: FBAccessToken,
      appsecret_proof: FBProofToken,
      fields: fields,
    },
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
    },
    json: true,
  }

  request(options, (error, response, facebookUser) => {
    if (error) return next(new Error(error))
    if (facebookUser.error) return next(new Error(
      facebookUser.error.message + ' => facebook_trace_id: ' + facebookUser.error.fbtrace_id
    ))

    logger.debug('Facebook user response object: ', facebookUser)
    const facebookId = facebookUser.id
    const email = facebookUser.email
    User.findOne({'facebook.id': facebookId}, (err, user) => {
      if (err) return next(err)

      if (!user) {
        User.findOne({'email': email}, (miss, userByEmail) => {
          if (miss) return next(miss)

          const uncompleteUser = userByEmail || new User()
          uncompleteUser.hydrateProfileWithFacebookData(facebookUser)
          uncompleteUser.save(mistake => {
            if (mistake) return next(mistake)

            res.json(outputFormat(getUserWithToken(uncompleteUser)))
          }))
          // if (!userByEmail) {
          //   const newUser = new User()
          //   newUser.hydrateProfileWithFacebookData(facebookUser)
          //   newUser.save(mistake => {
          //     if (mistake) return next(mistake)
          //
          //     res.json(outputFormat(getUserWithToken(newUser)))
          //   })
          // } else {
          //   // merge facebook to profile
          //   res.json(outputFormat(getUserWithToken(userByEmail)))
          // }
        }
      } else {
        res.json(outputFormat(getUserWithToken(user)))
      }
    })
  })
}