/* eslint-disable no-undef */
// import ExtensionStore from '@/utils/local-store'
try {
  chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    try {
      sendResponse({})
      // const localStore = new ExtensionStore()
      // const activeAccount = await localStore.get('activeAccount')
      if (request.method && request.method === 'fil_requestAccounts') {
        backgroundWindowOpen('pages/fiveToken-connect.html', request.width, request.origin)
      }

      if (request.method && request.method === 'fil_sendTransaction') {
        window.localStorage.setItem('fiveTokenConnectOrigin', request.origin)
        window.localStorage.setItem('fiveTokenSendTeansaction', JSON.stringify(request.params))
        backgroundWindowOpen('pages/custom-send-transaction.html', request.width, request.origin)
      }
    } catch (error) {
      throw new Error('backgrond.js addListener Error+' + JSON.stringify(error) + '')
    }
  })
} catch (e) {
  console.log('error')
}

export async function backgroundSendMessage (method, params) {
  chrome.tabs.query({ active: true }, function (tab) {
    chrome.tabs.sendMessage(tab[0].id, { method, data: params, from: 'background', to: 'content-script' }, function (res) {
      const lastError = chrome.runtime.lastError
      if (lastError) {
        throw new Error(lastError.message)
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

export function backgroundWindowRemove () {
  chrome.windows.getCurrent({}, function (event) {
    chrome.windows.remove(event.id)
  })
}
