import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
} from 'graphql'

import { saveOrUpdate } from '../utils/operations.mongodb'
import UserType from './userType.graphql'
import User from './user.schema'

const UserMutations = {
  addUser: {
    type: UserType,
    args: {
      id: {
        name: 'id',
        type: GraphQLString,
      },
      name: {
        name: 'name',
        type: new GraphQLNonNull(GraphQLString),
      },
      surname: {
        name: 'surname',
        type: new GraphQLNonNull(GraphQLString),
      },
      age:{
        name: 'age',
        type: GraphQLInt,
      },
    },
    resolve: saveOrUpdate(User),
    //   (root, args) => {
    //   return new Promise((resolve, reject) => {
    //     if (args.id) {
    //       User.findOneAndUpdate({ _id: args.id }, { $set: args }, { new: true }, (err, res) => {
    //         err ? reject(err): resolve(res)
    //       })
    //     } else {
    //       var newUser = new User(args);
    //       newUser.save((err, res) => {
    //         err ? reject(err): resolve(res)
    //       })
    //     }
    //   })
    // },
  },
}

export default UserMutations