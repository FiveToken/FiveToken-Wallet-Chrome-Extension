const PORT_POPUP_TO_CONTENT_SCRIPT = 'port-popup-to-content-script'
const POPUP_TO_CONTENT_SCRIPT = 'popup-to-content-script'
export function popupSendMessage (method, params) {
  // eslint-disable-next-line no-undef
  chrome.tabs.query({ active: true }, function (tab) {
    // eslint-disable-next-line no-undef
    const port = chrome.tabs.connect(tab[0].id, { name: PORT_POPUP_TO_CONTENT_SCRIPT })
    port.postMessage({
      from: POPUP_TO_CONTENT_SCRIPT,
      method,
      data: {
        ...params
      }
    })
    port.onMessage.addListener((data) => {

    })
  })
}

export function openUrl (url) {
  // eslint-disable-next-line no-undef
  chrome.tabs.create({ url }, function (tab) { })
}
