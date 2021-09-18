/* eslint-disable vue/script-setup-uses-vars */
const PORT_CONTENT_SCRIPT_TO_BACKGROUNT = 'port-content-script-to-background'
const PORT_POPUP_TO_CONTENT_SCRIPT = 'port-popup-to-content-script'
const INPAGE_TO_CONTENT_SCRIPT = 'inpage-to-content-script'
const CONTENT_SCRIPT_TO_INPAGE = 'content-script-to-inpage'
const BACKGROUND_TO_CONTENT_SCRIPT = 'background-to-content-script'

// dapp > content-script > background > content-script > dapp
export const inpage = () => {
  const ethereum = {
    isConnected: () => {
      return true
    },
    // pending fulfilled rejected
    mPromise: {
      eth_requestAccounts: 'fulfilled'
    },
    request: ({ method, params }) => {
      return new Promise((resolve, reject) => {
        try {
          // send message to content-script
          window.postMessage({
            from: 'inpage-to-content-script',
            method,
            params
          }, '*')
          // listen content-script postMessage
          window.addEventListener('message', (event) => {
            if (
              event &&
                            event.data && event.data.method === 'eth_requestAccounts' &&
                            event.data.from === 'content-script-to-inpage'
            ) {
              if (event.data.accountChanged) {
                ethereum.dispatchEvent('accountsChanged', event.data.message)
              }
              resolve(event.data.message)
            }
          })
        } catch (error) {
          reject(error)
        }
      })
    },

    _handlers: {

    },
    accountsChanged: () => {

    },
    chainChanged: () => {

    },
    removeListener: (type) => {
      if (!(type in ethereum._handlers)) {
        return new Error('Invalid event')
      }
    },
    dispatchEvent: (type, params) => {
      console.log(type, params, 'type,params')
      if (!(type in ethereum._handlers)) {
        return new Error('Not Registered')
      }
      ethereum._handlers[type].forEach(handler => {
        handler(params)
      })
    },
    addListener: (type, fn) => {
      if (!(ethereum._handlers[type])) {
        ethereum._handlers[type] = []
      }
      ethereum._handlers[type].push(fn)
    },
    on: (type, fn) => {
      const support = [
        'accountsChanged',
        'chainChanged'
      ]
      if (support.includes(type)) {
        ethereum.addListener(type, fn)
      }
    }
  }
  window.ethereum1 = ethereum
}

window.addEventListener('message', (event) => {
  // eslint-disable-next-line no-undef
  if (event.source === window && event.data.method && chrome.app && typeof chrome.app.isInstalled !== 'undefined') {
    const { method, params, from } = event.data
    if (from === INPAGE_TO_CONTENT_SCRIPT) {
      // eslint-disable-next-line no-undef
      const port = chrome.runtime.connect({ name: PORT_CONTENT_SCRIPT_TO_BACKGROUNT })
      // send message to background
      port.postMessage({
        method,
        params,
        origin: window.location.origin,
        width: window.outerWidth
      })
      // listen background postMessage
      port.onMessage.addListener((result) => {
        const { method, from, data } = result
        if (from === BACKGROUND_TO_CONTENT_SCRIPT) {
          // send message to dapp
          window.postMessage({
            from: CONTENT_SCRIPT_TO_INPAGE,
            method: method,
            message: data.message
          }, '*')
        }
      })
    }
  }
})

// listen popup send message
// eslint-disable-next-line no-undef
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === PORT_POPUP_TO_CONTENT_SCRIPT) {
    port.onMessage.addListener(async (result) => {
      // eslint-disable-next-line no-unused-vars
      const { method, from, data } = result
      console.log(result, 'PORT_POPUP_TO_CONTENT_SCRIPT 99999999')
      if (method === 'eth_requestAccounts') {
        // send message to dapp
        window.postMessage({
          from: CONTENT_SCRIPT_TO_INPAGE,
          method,
          message: data.message,
          accountChanged: data.accountChanged
        }, '*')
      }
    })
  }
})
