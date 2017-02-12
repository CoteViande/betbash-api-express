import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  // id: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   index: true,
  //   default: mongoose.Types.ObjectId,
  // },
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

export const getUserById = ({id}) => {
  return new Promise((resolve, reject) => {
    User.find({ id: id }).exec((err, res) => {
      err ? reject(err) : resolve(res[id]);
    })
  });
}

export const updateUser = user => {
  return new Promise((resolve, reject) => {
    user.save((err, res) => {
      err ? reject(err): resolve(res);
    });
  });
}

export const getListOfUsers = () => {
  return new Promise((resolve, reject) => {
    User.find({}).populate('hobbies friends').exec((err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
}