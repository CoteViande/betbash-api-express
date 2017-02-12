import express from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'
import schema from './models/schema.graphql'
import helmet from 'helmet'
import mongoose from 'mongoose'

const APP_PORT = process.env.port || 4000

mongoose.connect('mongodb://localhost:27017/coldroom')

const app = express()

app.use(helmet())

// const schema = buildSchema(schemaQL)
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}))

app.listen(APP_PORT, () => {
  console.log(`App ready: http://localhost:${APP_PORT}/graphql`)
})