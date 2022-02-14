/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', function () {
  injectCustomJs()
})

function injectCustomJs (jsPath) {
  jsPath = jsPath || 'js/inject.js'
  const temp = document.createElement('script')
  temp.setAttribute('type', 'text/javascript')
  temp.src = chrome.extension.getURL(jsPath)
  temp.onload = function () {
    this.parentNode.removeChild(this)
  }
  document.body.appendChild(temp)
}

window.addEventListener('message', (event) => {
  if (
    event.source === window &&
    event.data.method && chrome.app &&
    typeof chrome.app.isInstalled !== 'undefined'
  ) {
    const { method, params, from, to } = event.data
    if (from === 'inpage' && to === 'content-script') {
      sendMessageToBackground(method, params)
    }
  }
})

function sendMessageToBackground (method, params) {
  chrome.runtime.sendMessage({
    method,
    params,
    origin: window.location.origin,
    width: window.outerWidth
  }, function (response) {
    const lastError = chrome.runtime.lastError
    if (lastError) {
      throw new Error(lastError.message)
    }
  })
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { method: _method, data: _data, from, to } = request
  if (from === 'background' && to === 'content-script') {
    window.postMessage({
      from: 'content-script',
      to: 'inpage',
      method: _method,
      data: _data
    }, '*')
  }
  sendResponse('done')
  return true
})
