(function () {
  const FiveToken = {
    isFiveToken: true,
    version: '1.2.2',
    request: ({ method, params }) => {
      return new Promise((resolve, reject) => {
        try {
          // send message to content-script
          window.postMessage({
            from: 'inpage',
            to: 'content-script',
            method,
            params
          }, '*')
          // listen content-script postMessage
          window.addEventListener('message', (event) => {
            if (event && event.data && event.data.from === 'content-script' && event.data.to === 'inpage') {
              // fil_requestAccounts
              if (event.data.method === 'fil_requestAccounts' && event.data.data.account) {
                resolve(event.data.data.account)
              }

              // fil_chainId
              // develop...

              // fil_accounts
              // develop...

              // fil_sendTransaction
              if (event.data.method === 'fil_sendTransaction' && event.data.data.cid) {
                resolve(event.data.data.cid)
              }
            }
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    _handlers: { },
    removeListener: (type) => {
      if (!(type in FiveToken._handlers)) {
        return new Error('Invalid event')
      } else {
        delete FiveToken._handlers.type
      }
    },
    dispatchEvent: (type, params) => {
      if (!(type in FiveToken._handlers)) {
        return new Error('Not Registered')
      }
      FiveToken._handlers[type].forEach(handler => {
        handler(params)
      })
    },
    addListener: (type, fn) => {
      if (!(FiveToken._handlers[type])) {
        FiveToken._handlers[type] = []
      }
      FiveToken._handlers[type].push(fn)
    },
    on: (type, fn) => {
      const support = [
        'accountsChanged',
        'chainChanged'
      ]
      if (support.includes(type)) {
        FiveToken.addListener(type, fn)
      }
      FiveToken.addListener(type, fn)
      window.addEventListener('message', (event) => {
        // accountsChanged
        if (
          event && event.data && event.data.method === 'accountsChanged'
        ) {
          if (event.data.data.address) {
            FiveToken.dispatchEvent('accountsChanged', event.data.data.address)
          }
        }
        // chainChanged
        if (
          event && event.data && event.data.method === 'chainChanged'
        ) {
          if (event.data.data.chainID) {
            const ox = '0x' + Number(event.data.data.chainID).toString(16)
            FiveToken.dispatchEvent('chainChanged', ox)
          }
        }
      })
    }
  }
  window.FiveToken = FiveToken
})()
