import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import graphqlHTTP from 'express-graphql'
import morgan from 'morgan'

import logger from './utils/logger'
import schema from './models/schema.graphql'
import * as config from './config'
import { register, login } from './auth'

mongoose.connect('mongodb://localhost:27017/coldroom')
const app = express()
app.use(helmet())
app.use(bodyParser.json())
app.use(morgan('dev', {
  'stream': {
    write: (message, encoding) => logger.info(message),
  },
}))

// routes
app.get('/', (req, res) => {
  res.send('GET request to homepage')
})

app.post('/post', (req, res) => {
  res.send('POST request to /post page')
})

// curl --data "email=yo@ya.yu&password=something" http://localhost:4000/register
app.post('/register', register)
app.post('/login', login)

app.use(config.GRAPHQL_URL, graphqlHTTP({
  schema,
  graphiql: true,
}))

app.use((err, req, res, next) => {
  logger.error(err)
  if (err.name === 'UnauthorizedError') {
    res.status(401)
    res.json({
      "message" : err.name + ": " + err.message
    })
  }
})

app.listen(config.APP_PORT, () => {
  logger.debug(`App ready: http://localhost:${config.APP_PORT}${config.GRAPHQL_URL}`)
})