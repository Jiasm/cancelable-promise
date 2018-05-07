const {CancelablePromise, PromiseCancelError} = require('../')

function delay () {
  return new CancelablePromise(resolve => {
    setTimeout(_ => resolve(123), 1000)
  })
}

function main () {
  let pro = delay().then(_ => {
    console.log(`got data: ${_}`)
    return new CancelablePromise((resolve, reject, cancel) => {
      setTimeout(cancel, 2000)
    })
  }).then(console.log, console.error, err => {
    console.log(err.message)
  })
}

main()
