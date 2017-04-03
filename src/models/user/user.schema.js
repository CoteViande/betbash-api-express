import mongoose from '../mongoose.config'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import * as config from '../../config'
import logger from '../../utils/logger'

import {
  getObjectById,
  getAllObjects,
  saveOrUpdate,
} from '../utils/operations.mongodb'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required : true,
  },
  password: {
    email: {
      type: String,
      unique: true,
      required: false,
    },
    hash: String,
    salt: String,
  },
  facebook: {
    id: {
      type: String,
      unique: true,
      required : false,
    },
    email: String,
    data: String,
  },
  name: {
    firstName: String,
    lastName: String,
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
})

UserSchema.methods.setPassword = function(password) {
  this.password.salt = crypto.randomBytes(16).toString('hex');
  this.password.hash = crypto.pbkdf2Sync(password, this.password.salt, 1000, 64).toString('hex');
}
UserSchema.methods.isPasswordValid = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.password.salt, 1000, 64).toString('hex')
  return this.password.hash === hash
}

const jwtConfig = config.jwt()
UserSchema.methods.generateJWToken = function() {
  const value = jwt.sign({
    data: {
      id: this._id,
    },
    // scopes: user.scopes, // SUPER_ADMIN ADMIN
  }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiration,
  })
  const expiresAt = moment().add(jwtConfig.expiration, 'seconds')
  return {
    value,
    expiresAt,
  }
}

UserSchema.methods.getFullName = function() {
  return (this.firstName + ' ' + this.lastName)
}
UserSchema.methods.hydrateProfileWithFacebook = function(facebookData) {
  if (this.facebook.id && this.facebook.id !== facebookUser.id) { // possible on FB login email case?
    logger.warn(`Overrinding facebook id, from ${this.facebook.id} to ${facebookUser.id}`)
  }
  this.facebook.id = facebookUser.id
  if (!facebookUser.email) {
    logger.warn(`No email in Facebook profile of ${facebookUser.id}`)
  }
  this.facebook.email = facebookUser.email
  if (!this.email) {
    this.email = facebookUser.email || 'unknown'
  }
  this.name.firstName = facebookUser.name.first_name
  this.name.lastName = facebookUser.name.last_name
  this.facebook.data = facebookUser // TODO check if possible (stringify?)
}

UserSchema.set('toJSON', { getters: true })

const User = mongoose.model('User', UserSchema)
export default User

export const getUserById = getObjectById(User)
export const saveOrUpdateUser = saveOrUpdate(User)
export const getListOfUsers = getAllObjects(User)