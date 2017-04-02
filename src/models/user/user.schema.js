import mongoose from '../mongoose.config'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import * as config from '../../config'

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
    name: String,
  },
  logoutFromAllDevicesAt: Date, // unused
  name: String,
  surname: String,
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
  return jwt.sign({
    data: {
      id: this._id,
    },
    // scopes: user.scopes, // SUPER_ADMIN ADMIN
  }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiration,
  })
}

UserSchema.set('toJSON', { getters: true })

const User = mongoose.model('User', UserSchema)
export default User

export const getUserById = getObjectById(User)
export const saveOrUpdateUser = saveOrUpdate(User)
export const getListOfUsers = getAllObjects(User)