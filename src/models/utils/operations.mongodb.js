export const saveOrUpdate = Model => (root, args) => (
  new Promise((resolve, reject) => {
    if (args.id) {
      Model.findOneAndUpdate({ _id: args.id }, { $set: args }, { new: true }, (err, res) => {
        err ? reject(err): resolve(res)
      })
    } else {
      var newUser = new Model(args);
      newUser.save((err, res) => {
        err ? reject(err): resolve(res)
      })
    }
  })
)