import User from './models/user/user.schema'
import logger from './utils/logger'

export const register = (req, res, next) => {
  if (!req.body || !req.body.email || !req.body.password) {
    logger.warn('Something not set')
    return res.sendStatus(400)
  }
  const user = new User()
  logger.debug(user)

  user.email = req.body.email
  user.setPassword(req.body.password)
  logger.debug(user)

  user.save((err, res) => {
    if (err) {
      logger.debug(err)
      throw err
    } else {
      logger.debug('saving')
      const token = user.generateJwt();
      res.status(200)
      res.json({
        "token" : token,
      })
      next()
    }
  })
}
