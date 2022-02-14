/* eslint-disable no-unused-vars */

import { backgroundSendMessage, backgroundWindowRemove } from './background.js'
export function popupToBackground (method, params) {
  backgroundSendMessage(method, params)
}
export function popupWindowRemove () {
  backgroundWindowRemove()
}

export function openUrl (url) {
  // eslint-disable-next-line no-undef
  chrome.tabs.create({ url }, function (tab) { })
}
