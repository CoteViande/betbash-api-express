// Getters
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

// Setters
export const saveObject = Model => (root, args) => (
  new Promise((resolve, reject) => {
    var newObject = new Model(args)
    newObject.save((err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
)

const backupObject = (Model, object) => (
  new Promise((resolve, reject) => {
    const backup = object.toObject() // clone data
    backup.papaId = object._id
    delete backup._id
    Model.create(backup, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
)

export const updateObject = Model => (root, args) => (
  new Promise((resolve, reject) => {
    Model.findOne({ _id: args.id }).exec(async (error, object) => {
      if (error) { reject(error) }
      try {
        await backupObject(Model, object)
      } catch (err) {
        resject(err)
      }
      object.set(args)
      object.set({ timestamp: new Date })
      object.save((err, res) => {
        err ? reject(err): resolve(res)
      })
    })
  })
)

export const saveOrUpdate = Model => (root, args) => {
  if (args.id) return updateObject(Model)(root, args)
  return saveObject(Model)(root, args)
}

export const removeObject = Model => (root, args) => {
  if (!args.id) throw new Error("Cannot remove unexisting object")
  updateObject(Model)(root, { id: args.id, deleted: true })
}