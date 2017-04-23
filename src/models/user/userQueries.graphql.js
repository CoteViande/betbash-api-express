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
import { isAdminOrSelf } from '../utils/authorization'

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
    resolve: (root, args, context) => {
      isAdminOrSelf(context.signature, args.id) // TODO change this fissa
      return getUserById(root, args)
    },
  },
}