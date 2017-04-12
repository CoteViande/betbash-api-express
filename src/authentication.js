import crypto from 'crypto'

import User from './models/user/user.schema'
import * as config from './config'
import { lookup } from './utils/inputFormat'
import outputFormat from './utils/outputFormat'
import { UserAlreadyExistsError, InvalidCredentialsError } from './utils/errors'
import requestPromise from './utils/requestPromise'
import logger from './utils/logger'

const getUserWithToken = user => ({
  token: user.generateJWToken(),
  id: user._id,
  name: user.name,
  email: user.email,
})

export const register = async (req, res, next) => {
  try {
    const email = lookup(req, 'email', true)
    const password = lookup(req, 'password', true)

    const userAlreadyExists = await User.findOne({ 'password.email': email })
    if (!!userAlreadyExists) throw new UserAlreadyExistsError()

    let user = new User()
    user.email = email
    user.password.email = email
    user.setPassword(password)

    user = await user.save()
    res.json(outputFormat(getUserWithToken(user)))
  } catch (err) {
    next(err)
  }
}

export const signInWithEmail = async (email, password) => {
  const user = await User.findOne({ 'password.email': email })

  if (!user) throw new InvalidCredentialsError()
  if (!user.isPasswordValid(password)) throw new InvalidCredentialsError()

  return user
}

export const login = async (req, res, next) => {
  try {
    const email = lookup(req, 'email', true)
    const password = lookup(req, 'password', true)

    const user = await signInWithEmail(email, password)

    res.json(outputFormat(getUserWithToken(user)))
  } catch (err) {
    next(err)
  }
}

const appSecretProof = (FBAppSecret, FBAccessToken) => (
  crypto.createHmac('sha256', FBAppSecret).update(FBAccessToken).digest('hex')
)

export const signInWithFacebook = async FBAccessToken => {
  const options = {
    method: 'GET',
    url: `https://graph.facebook.com/${config.facebook().graphVersion}/me`,
    qs: {
      access_token: FBAccessToken,
      appsecret_proof: appSecretProof(config.facebook().secret, FBAccessToken),
      fields: config.facebook().fields,
    },
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
    },
    json: true,
  }

  const facebookUser = await requestPromise(options)
  logger.debug('Facebook user response object: ', facebookUser)
  if (facebookUser.error) throw new Error(
    facebookUser.error.message + ' => facebook_trace_id: ' + facebookUser.error.fbtrace_id
  )

  const facebookId = facebookUser.id
  const email = facebookUser.email

  let user = await User.findOne({'facebook.id': facebookId})
  if (!user) {
    user = await User.findOne({'email': email})
    user = user || new User()

    user.hydrateProfileWithFacebook(facebookUser)
    user = await user.save()
  }
  return user
}

export const facebookSignIn = async (req, res, next) => {
  try {
    const FBAccessToken = lookup(req, 'FBAccessToken', true)

    const user = await facebookGetToken(FBAccessToken)

    res.json(outputFormat(getUserWithToken(user)))
  } catch (err) {
    next(err)
  }
}