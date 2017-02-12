import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql'

import mongoose from 'mongoose'
import User from './user/user.schema'

import {
  UserQueries,
  UserMutations,
  UserType,
} from './user/user.graphql'

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    user: UserQueries.user,
    users: UserQueries.users,
  })
})


const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addUser: UserMutations.addUser,
  })
})


const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
})

export default schema