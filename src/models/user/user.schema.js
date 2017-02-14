import mongoose from '../mongoose.config'

import {
  getObjectById,
  getAllObjects,
  saveOrUpdate,
} from '../utils/operations.mongodb'

const UserSchema = new mongoose.Schema({
  name: String,
  surname: String,
  age: Number,
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  type: String,
})

UserSchema.set('toJSON', { getters: true })

const User = mongoose.model('User', UserSchema)

export default User

export const getUserById = getObjectById(User)

export const saveOrUpdateUser = saveOrUpdate(User)

export const getListOfUsers = getAllObjects(User)