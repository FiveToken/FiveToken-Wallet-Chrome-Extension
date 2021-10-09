/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.method && request.method === 'fil_requestAccounts') {
    backgroundWindowOpen('pages/fiveToken-connect.html', request.width, request.origin)
  }

  if (request.method && request.method === 'fil_sendTransaction') {
    window.localStorage.setItem('fiveTokenConnectOrigin', request.origin)
    window.localStorage.setItem('fiveTokenSendTeansaction', JSON.stringify(request.params))
    backgroundWindowOpen('pages/custom-send-transaction.html', request.width, request.origin)
  }
  sendResponse('done')
  return true
})

async function backgroundSendMessage (method, params) {
  chrome.tabs.query({ active: true }, function (tab) {
    chrome.tabs.sendMessage(tab[0].id, { method, data: params, from: 'background', to: 'content-script' }, function (res) {
      const lastError = chrome.runtime.lastError
      if (lastError) {
        console.log(lastError)
      }
    })
  })
}

function backgroundWindowOpen (url, width, origin) {
  chrome.windows.getCurrent({}, function (event) {
    chrome.windows.create({
      url: url,
      width: 360,
      height: 610,
      left: event.left + width - 360,
      top: event.top,
      type: 'popup'
    }, function () {

    })
  })
}

function backgroundWindowRemove () {
  chrome.windows.getCurrent({}, function (event) {
    chrome.windows.remove(event.id)
  })
}
