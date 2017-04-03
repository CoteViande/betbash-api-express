import request from 'request'

const requestPromise = options => (
  new Promise((resolve, reject) => {
    request(options, (error, res, body) => {
      if (error) {
        reject(error)
      } else {
        resolve(body)
      }
    })
  })
)