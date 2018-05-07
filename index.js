(() => {
  class PromiseCancelError extends Error {}

  function CancelablePromise (func) {
    let rejectCaller
    let cancelCaller = msg => {
      rejectCaller(new PromiseCancelError(msg || 'promise canceled'))
    }
    let pro = new Promise((resolve, reject) => {
      rejectCaller = reject
      func(resolve, rejectCaller, cancelCaller)
    })

    pro.then = (oldThen =>
      (resolveHandler, rejectHandler, cancelHandler) =>
        new CancelablePromise((resolve, reject) =>
          oldThen.call(pro, resolveHandler, err => {
            if (err instanceof PromiseCancelError) {
              if (cancelHandler) {
                return cancelHandler(err)
              }
            }

            return rejectHandler && rejectHandler(err)
          }).then(resolve, reject)
        )
    )(pro.then)

    pro.catch = (oldCatch =>
      (rejectHandler) =>
        new CancelablePromise((resolve, reject) =>
          oldCatch.call(pro, rejectHandler).then(resolve, reject)
        )
    )(pro.catch)

    pro.finally = (oldFinally =>
      (finallyHandler) =>
        new CancelablePromise((resolve, reject) =>
          oldFinally.call(pro, oldFinally).then(resolve, reject)
        )
    )(pro.finally)

    pro.cancel = cancelCaller

    return pro
  }

  if (typeof window !== 'undefined') {
    window.CancelablePromise = CancelablePromise
    window.PromiseCancelError = PromiseCancelError
  } else if (typeof module !== 'undefined') {
    module.exports = {
      CancelablePromise,
      PromiseCancelError
    }
  } else {
    return CancelablePromise
  }
})()
