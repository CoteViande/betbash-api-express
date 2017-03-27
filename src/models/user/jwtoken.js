import jwt from 'jsonwebtoken'
import * as config from '../../config'

const jwtConfig = config.jwt()

export const generateJWToken = function() {
  return jwt.sign({
    data: {
      id: this._id,
    },
    // scopes: user.scopes, SUPER_ADMIN ADMIN
  }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiration,
  })
}