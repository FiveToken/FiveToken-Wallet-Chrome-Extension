/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-undef
const background = chrome.extension.getBackgroundPage()

function popupToBackground (method, params, database) {
  background.backgroundSendMessage(method, params, database)
}
function popupWindowRemove () {
  background.backgroundWindowRemove()
}

function openUrl (url) {
  // eslint-disable-next-line no-undef
  chrome.tabs.create({ url }, function (tab) {
    // chrome.tabs.executeScript(tab.id, {file: 'src/contentScript2'});
  })
}
