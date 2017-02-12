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
import { getListOfUsers, getUserById } from './user.schema'

export default {
  users: {
    type: new GraphQLList(UserType),
    resolve: getListOfUsers,
  },
  user: {
    type: UserType,
    args: {
      id: {
        type: GraphQLID
      },
    },
    resolve: getUserById,
  },
}