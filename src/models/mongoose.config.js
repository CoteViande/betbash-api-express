import mongoose from 'mongoose'
import baseSchema from './utils/baseSchema.mongodb'

mongoose.Promise = global.Promise
mongoose.plugin(baseSchema)

export default mongoose