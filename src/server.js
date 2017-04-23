import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import graphqlHTTP from 'express-graphql'
import morgan from 'morgan'

import * as config from './config'
import * as authentication from './authentication'
import * as tokenHandler from './tokenHandler'
import schema from './models/schema.graphql'
import { errorHandler } from './utils/errors'
import logger from './utils/logger'

mongoose.connect(config.MONGODB_URL)
const app = express()
app.use(helmet())
app.use(bodyParser.json())

app.use(morgan('dev', { // loggerMiddleware
  'stream': {
    write: (message, encoding) => logger.info(message),
  },
}))


app.post('/register', authentication.register)
app.post('/login', authentication.login)
app.get('/facebook/signin', authentication.facebookSignIn)

app.use(tokenHandler.refreshToken)
app.use(tokenHandler.identifySignature)

app.use(config.GRAPHQL_URL, graphqlHTTP(
  req => ({
    schema,
    rootValue: {
      signature: req.signature,
    },
    graphiql: true,
  })
))

app.use(errorHandler)

app.listen(config.APP_PORT, () => {
  logger.debug(`App ready: http://localhost:${config.APP_PORT}${config.GRAPHQL_URL}`)
})