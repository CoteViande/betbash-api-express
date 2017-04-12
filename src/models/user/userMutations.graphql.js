// mutation ($id: String, $name: String!, $surname: String!, $age: Int) {
//   addUser(id: $id, name: $name, surname: $surname, age: $age) {
//     _id
//     name
//     surname
//     age
//   }
// }

// {
//   "id": "58a090044efda022f5523239",
//   "name": "Encore",
//   "surname": "Un Autre modifié moultes fois"
// }

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
import { saveOrUpdateUser } from './user.schema'

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
    },
    resolve: saveOrUpdateUser,
  },
}

export default UserMutations