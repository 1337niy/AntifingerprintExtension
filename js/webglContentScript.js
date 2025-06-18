;(function () {
  function injectScript() {
    let parent = document.documentElement
    let script = document.createElement('script')
    script.src = chrome.runtime.getURL('js/webglSpoofScript.js')
    script.async = false
    parent.insertBefore(script, parent.firstChild)
    parent.removeChild(script)
  }

  injectScript()
})()
