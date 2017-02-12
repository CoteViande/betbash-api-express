export const getObjectById = Model => (root, args) => (
  new Promise((resolve, reject) => {
    Model.findOne({ _id: args.id }).exec((err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
)

export const getAllObjects = Model => (root, args) =>(
  new Promise((resolve, reject) => {
    Model.find({}).exec((err, res) => {
      err ? reject(err) : resolve(res);
    })
  })
)

export const saveObject = Model => (root, args) => (
  new Promise((resolve, reject) => {
    var newObject = new Model(args)
    newObject.save((err, res) => {
      err ? reject(err): resolve(res)
    })
  })
)

export const updateObject = Model => (root, args) => (
  new Promise((resolve, reject) => {
    Model.findOneAndUpdate({ _id: args.id }, { $set: args }, { new: true }, (err, res) => {
      err ? reject(err): resolve(res)
    })
  })
)

export const saveOrUpdate = Model => (root, args) => {
  if (args.id) {
    return updateObject(Model)(root, args)
  }
  return saveObject(Model)(root, args)
}