import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
} from 'graphql'

import UserType from './userType.graphql'
import User from './user.schema'

export default {
  users: {
    type: new GraphQLList(UserType),
    resolve: User.getListOfUsers,
  },
  user: {
    type: UserType,
    args: {
      id: {
        type: GraphQLID
      },
    },
    resolve: User.getUserById,
  },
}