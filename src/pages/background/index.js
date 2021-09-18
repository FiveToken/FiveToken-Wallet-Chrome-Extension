/* eslint-disable no-undef */
import { Database } from '@/utils/database.js'
const PORT_CONTENT_SCRIPT_TO_BACKGROUNT = 'port-content-script-to-background'
const PORT_BACKGROUND_TO_CONTENT_SCRIPT = 'port-background-to-content-script'
const BACKGROUND_TO_CONTENT_SCRIPT = 'background-to-content-script'

// listen content script message
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === PORT_CONTENT_SCRIPT_TO_BACKGROUNT) {
    port.onMessage.addListener(async function (data) {
      if (data.method && data.method === 'eth_requestAccounts') {
        const db = new Database()
        const activeAccount = await db.getTable('activeAccount', { khazix: 'khazix' })
        const connectAccount = await db.getTable('connectAccount', { khazix: 'khazix' })
        if (connectAccount.length) {
          const account = activeAccount.map(n => {
            return n.address
          })
          port.postMessage({
            from: BACKGROUND_TO_CONTENT_SCRIPT,
            method: data.method,
            data: {
              message: account
            }
          })
        } else {
          backgroundWindowOpen(data.width, data.origin)
        }
      };
    })
  }
})

function backgroundWindowOpen (width, origin) {
  chrome.windows.getCurrent({}, function (event) {
    chrome.windows.create({
      url: 'pages/fiveToken-connect.html',
      width: 360,
      height: 600,
      left: event.left + width - 360,
      top: event.top,
      type: 'popup'
    }, function () {
      window.localStorage.setItem('fiveTokenConnect', origin)
    })
  })
}

export function backgroundWindowRemove () {
  chrome.windows.getCurrent({}, function (event) {
    chrome.windows.remove(event.id)
  })
}

export function backgroundSendMessage (tag, data, cb) {
  chrome.tabs.query({ active: true }, function (tab) {
    const port = chrome.tabs.connect({ name: PORT_BACKGROUND_TO_CONTENT_SCRIPT })
    port.postMessage({ method, params })
    port.onMessage.addListener((data) => {

    })
  })
}
