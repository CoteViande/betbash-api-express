export const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/coldroom'
export const APP_PORT = process.env.port || 4000
export const GRAPHQL_URL = '/api'

export const jwt = () => {
  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development' && process.env.JWT_SECRET === undefined) {
    throw new Error('Please define a environment variable for JWT (process.env.JWT_SECRET)')
    return
  }
  return ({
    secret: process.env.JWT_SECRET || 'jEsuIs1STr!nG$éCrèTediFFICil3à2-VIE-NeZ',
    expiration: 15 * 60, // seconds
  })
}
export const facebook = () => {
  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development' && process.env.FACEBOOK_APP_SECRET === undefined) {
    throw new Error('Please define a environment variable for FACEBOOK (process.env.FACEBOOK_APP_SECRET)')
    return
  }
  return({
    secret: process.env.FACEBOOK_APP_SECRET || '6b466ac6ac5fafcb9ba569ebea602455',
    public: process.env.NODE_ENV !== 'development' ? 'PUBLIC_ID' : 'TEST_PUBLIC_ID',
    fields: 'id,email,picture.type(large),first_name,last_name,middle_name,link,gender',
    graphVersion: 'v2.8',
  })
}