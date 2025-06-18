// Логика подмены HTTP заголовков

function spoofHeaders(headersSpoofed, callback) {
  let userAgent = ''
  let acceptLanguage = ''
  
  if (headersSpoofed) {
    userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0'
    acceptLanguage = 'en-US,en;q=0.9'
  } else {
    userAgent = window.navigator.userAgent
    acceptLanguage = window.navigator.languages.join(',')
  }
  
  chrome.declarativeNetRequest.updateDynamicRules(
    {
      removeRuleIds: [1],
      addRules: headersSpoofed
        ? [
            {
              id: 1,
              priority: 10,
              action: {
                type: 'modifyHeaders',
                requestHeaders: [
                  {
                    header: 'user-agent',
                    operation: 'set',
                    value: userAgent,
                  },
                  {
                    header: 'accept-language',
                    operation: 'set',
                    value: acceptLanguage,
                  },
                ],
              },
              condition: {
                urlFilter: '*',
                resourceTypes: [
                  'main_frame',
                  'sub_frame',
                  'xmlhttprequest',
                  'script',
                  'stylesheet',
                  'image',
                  'font',
                  'object',
                  'media',
                  'websocket',
                  'other',
                ],
              },
            },
          ]
        : [],
    },
    callback
  )
}

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { spoofHeaders }
}