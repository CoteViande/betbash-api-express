import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import graphqlHTTP from 'express-graphql'
import morgan from 'morgan'

import * as config from './config'
import * as auth from './auth'
import schema from './models/schema.graphql'
import { errorHandler } from './utils/errors'
import logger from './utils/logger'

mongoose.connect(config.MONGODB_URL)
const app = express()
app.use(helmet())
app.use(bodyParser.json())
app.use(morgan('dev', {
  'stream': {
    write: (message, encoding) => logger.info(message),
  },
}))


app.post('/register', auth.register)
app.post('/login', auth.login)
app.get('/facebook/signin', auth.facebookSignIn)

app.use(config.GRAPHQL_URL, graphqlHTTP({
  schema,
  graphiql: true,
}))

app.use(errorHandler)

app.listen(config.APP_PORT, () => {
  logger.debug(`App ready: http://localhost:${config.APP_PORT}${config.GRAPHQL_URL}`)
})