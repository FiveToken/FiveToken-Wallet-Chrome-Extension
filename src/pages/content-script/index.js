import { inpage } from './inpage.js'

(function insertScript (w) {
  injectScript(inpage)
})(window)

function injectScript (content) {
  try {
    const container = document.head || document.documentElement
    const scriptTag = document.createElement('script')
    scriptTag.setAttribute('async', 'false')
    scriptTag.text = `(${content.toString()})();`
    container.insertBefore(scriptTag, container.children[0])
    container.removeChild(scriptTag)
  } catch (error) {
    console.error('FiveToken: Provider injection failed.', error)
  }
}
