import User from './models/user/user.schema'
import logger from './utils/logger'

export const register = (req, res, next) => {
  if (!req.body || !req.body.email || !req.body.password) {
    return res.sendStatus(400)
  }
  const user = new User()

  user.email = req.body.email
  user.setPassword(req.body.password)

  user.save(err => {
    if (err) {
      logger.debug(err)
      throw err
    } else {
      const token = user.generateJWToken()
      res.json({
        id: user._id,
        token,
      })
      res.status(200)
      next()
    }
  })
}

export const login = (req, res, next) => {
  if (!req.body || !req.body.email || !req.body.password) return res.sendStatus(400)

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      logger.error(err)
      throw err
    } else {
      if (!user) return res.sendStatus(404)
      if (!user.isPasswordValid(req.body.password)) return res.sendStatus(401)

      const token = user.generateJWToken()
      res.json({
        id: user._id,
        token,
      })
      res.status(200)
      next()
    }
  })
}