window.onload = (event) => {
  const spoofNavBtn = document.querySelector('#spoofNav')
  const spoofHeadersBtn = document.querySelector('#spoofHeaders')
  const spoofWebGLBtn = document.querySelector('#spoofWebGL')
  const blockJSBtn = document.querySelector('#blockJS')
  const spinner = document.querySelector('#spinner')

  chrome.storage.sync.get('NAV_SPOOFED', ({ NAV_SPOOFED }) => {
    if (NAV_SPOOFED) {
      spoofNavBtn.textContent = 'Navigator Spoofed'
      spoofNavBtn.classList.add('btn-danger')
      spoofNavBtn.classList.remove('btn-primary')
    } else {
      spoofNavBtn.textContent = 'Spoof Navigator'
      spoofNavBtn.classList.add('btn-primary')
      spoofNavBtn.classList.remove('btn-danger')
    }
  })

  chrome.storage.sync.get('WEBGL_SPOOFED', ({ WEBGL_SPOOFED }) => {
    if (WEBGL_SPOOFED) {
      spoofWebGLBtn.textContent = 'WebGL Spoofed'
      spoofWebGLBtn.classList.add('btn-danger')
      spoofWebGLBtn.classList.remove('btn-primary')
    } else {
      spoofWebGLBtn.textContent = 'Spoof WebGL'
      spoofWebGLBtn.classList.add('btn-primary')
      spoofWebGLBtn.classList.remove('btn-danger')
    }
  })

  chrome.storage.sync.get('HEADERS_SPOOFED', ({ HEADERS_SPOOFED }) => {
    if (HEADERS_SPOOFED) {
      spoofHeadersBtn.textContent = 'HTTP Headers Spoofed'
      spoofHeadersBtn.classList.add('btn-danger')
      spoofHeadersBtn.classList.remove('btn-primary')
    } else {
      spoofHeadersBtn.textContent = 'Spoof HTTP Headers'
      spoofHeadersBtn.classList.add('btn-primary')
      spoofHeadersBtn.classList.remove('btn-danger')
    }
  })

  chrome.storage.sync.get('JS_BLOCKED', ({ JS_BLOCKED }) => {
    if (JS_BLOCKED) {
      blockJSBtn.textContent = 'JS Blocked'
      blockJSBtn.classList.add('btn-danger')
      blockJSBtn.classList.remove('btn-primary')
    } else {
      blockJSBtn.textContent = 'Block JS'
      blockJSBtn.classList.add('btn-primary')
      blockJSBtn.classList.remove('btn-danger')
    }
  })

  spoofNavBtn.addEventListener('click', (event) => {
    spinner.classList.remove('d-none')
    chrome.storage.sync.get('NAV_SPOOFED', ({ NAV_SPOOFED }) => {
      const navSpoofed = !NAV_SPOOFED
      chrome.storage.sync.set({ NAV_SPOOFED: navSpoofed }, () => {
        if (navSpoofed) {
          spoofNavBtn.textContent = 'Navigator Spoofed'
        } else {
          spoofNavBtn.textContent = 'Spoof Navigator'
        }
        switchBtnState(spoofNavBtn)
        spinner.classList.add('d-none')
        spoofNavigator(navSpoofed)
      })
    })
  })

  spoofWebGLBtn.addEventListener('click', (event) => {
    spinner.classList.remove('d-none')
    chrome.storage.sync.get('WEBGL_SPOOFED', ({ WEBGL_SPOOFED }) => {
      const webglSpoofed = !WEBGL_SPOOFED
      chrome.storage.sync.set({ WEBGL_SPOOFED: webglSpoofed }, async () => {
        if (webglSpoofed) {
          spoofWebGLBtn.textContent = 'WebGL Spoofed'
        } else {
          spoofWebGLBtn.textContent = 'Spoof WebGL'
        }
        switchBtnState(spoofWebGLBtn)
        spinner.classList.add('d-none')
        spoofWebGL(webglSpoofed)
      })
    })
  })

  spoofHeadersBtn.addEventListener('click', (event) => {
    spinner.classList.remove('d-none')
    chrome.storage.sync.get('HEADERS_SPOOFED', ({ HEADERS_SPOOFED }) => {
      const headersSpoofed = !HEADERS_SPOOFED
      chrome.storage.sync.set({ HEADERS_SPOOFED: headersSpoofed }, () => {
        if (headersSpoofed) {
          spoofHeadersBtn.textContent = 'HTTP Headers Spoofed'
        } else {
          spoofHeadersBtn.textContent = 'Spoof HTTP Headers'
        }
        spoofHeaders(headersSpoofed, () => {
          switchBtnState(spoofHeadersBtn)
          spinner.classList.add('d-none')
          reload()
        })
      })
    })
  })

  blockJSBtn.addEventListener('click', (event) => {
    spinner.classList.remove('d-none')
    chrome.storage.sync.get('JS_BLOCKED', ({ JS_BLOCKED }) => {
      const jsBlocked = !JS_BLOCKED
      chrome.storage.sync.set({ JS_BLOCKED: jsBlocked }, () => {
        if (jsBlocked) {
          blockJSBtn.textContent = 'JS Blocked'
        } else {
          blockJSBtn.textContent = 'Block JS'
        }
        blockJS(jsBlocked)
      })
    })
  })

  async function getCurrentTabId() {
    let [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })
    return tab.id
  }

  async function reload() {
    const tabId = await getCurrentTabId()
    chrome.tabs.reload(tabId, { bypassCache: true })
  }

  function switchBtnState(btn) {
    btn.classList.toggle('btn-primary')
    btn.classList.toggle('btn-danger')
  }

  function spoofNavigator(navSpoofed) {
    const id = 'inject_script_navigator'
    if (navSpoofed) {
      chrome.scripting.registerContentScripts(
        [
          {
            id,
            matches: ['<all_urls>'],
            allFrames: true,
            runAt: 'document_start',
            js: ['js/navigatorContentScript.js'],
          },
        ],
        () => {
          reload()
        }
      )
    } else {
      chrome.scripting.unregisterContentScripts({ ids: [id] }, () => {
        reload()
      })
    }
  }

  async function spoofWebGL(webglSpoofed) {
    const id = 'inject_script_webgl'
    if (webglSpoofed) {
      chrome.scripting.registerContentScripts(
        [
          {
            id,
            matches: ['<all_urls>'],
            allFrames: true,
            runAt: 'document_start',
            js: ['js/webglContentScript.js'],
          },
        ],
        () => {
          reload()
        }
      )
    } else {
      chrome.scripting.unregisterContentScripts({ ids: [id] }, () => {
        reload()
      })
    }
  }

  function blockJS(jsBlocked) {
    chrome.contentSettings['javascript'].set(
      {
        primaryPattern: '<all_urls>',
        setting: jsBlocked ? 'block' : 'allow',
      },
      () => {
        switchBtnState(blockJSBtn)
        spinner.classList.add('d-none')
        reload()
      }
    )
  }
}
