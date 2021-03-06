# cancelable-promise

一个可以取消的`Promise`，完美兼容普通`Promise`的使用

```javascript
const {CancelablePromise, PromiseCancelError} = require('../')

function delay () {
  return new CancelablePromise(resolve => {
    setTimeout(_ => resolve('delay'), 1000)
  })
}

function delayCancel () {
  return new CancelablePromise((resolve, reject, cancel) => {
    setTimeout(_ => cancel('cancel it'), 1000)
  })
}

async function main () {
  try {
    console.log(await delay())

    await delayCancel()
  } catch (e) {
    if (e instanceof PromiseCancelError) {
      console.log(e.message) // promise canceled
    } else {
      console.error('error:', e)
    }
  }
}

main()
```
