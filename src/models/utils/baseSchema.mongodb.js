import mongoose from '../mongoose.config'

const baseSchemaFunction = (schema, options) => {
  schema.add({
    timestamp: {
      type: Date,
      default: Date.now,
    },
    papaId: mongoose.Schema.Types.ObjectId,
    deleted: {
      type: Boolean,
      default: false,
    },
  })
}

export default baseSchemaFunction