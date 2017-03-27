export const APP_PORT = process.env.port || 4000
export const GRAPHQL_URL = '/api'

export const jwt = () => {
  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development' && process.env.JWT_SECRET === undefined) {
    throw new Error('Please define a environment variable for JWT (process.env.JWT_SECRET)')
    return
  }
  return ({
    secret: process.env.JWT_SECRET || 'jEsuIs1STr!nG$éCrèTediFFICil3à2-VIE-NeZ',
    expiration: 60 * 60, // seconds
  })
}