Object.defineProperty(navigator, 'platform', {
  get: () => 'Linux',
})

Object.defineProperty(navigator, 'plugins', {
  get: () => {
    return {
      length: 0,
      item: () => null,
      namedItem: () => null,
      refresh: () => {},
    }
  },
})

Object.defineProperty(navigator, 'userAgent', {
  get: () =>
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
})

Object.defineProperty(navigator, 'appVersion', {
  get: () =>
    '5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
})

Object.defineProperty(navigator, 'userAgentData', {
  get: () => undefined,
})

Object.defineProperty(navigator, 'language', {
  get: () => 'en-US',
})

Object.defineProperty(navigator, 'languages', {
  get: () => ['en-US', 'en'],
})

Object.defineProperty(navigator, 'deviceMemory', {
  get: () => 16,
})

Object.defineProperty(navigator, 'getBattery', {
  get: () => () => undefined,
})

Object.defineProperty(navigator, 'connection', {
  get: () => undefined,
})

Object.defineProperty(navigator, 'mediaDevices', {
  get: () => undefined,
})

Object.defineProperty(navigator, 'mimeTypes', {
  get: () => [],
})

Object.defineProperty(navigator, 'hardwareConcurrency', {
  get: () => 8,
})

Object.defineProperty(screen, 'width', {
  get: () => 1337,
})

Object.defineProperty(screen, 'height', {
  get: () => 777,
})

Object.defineProperty(screen, 'availWidth', {
  get: () => 1337,
})

Object.defineProperty(screen, 'availHeight', {
  get: () => 777,
})

Object.defineProperty(Date.prototype, 'getTimezoneOffset', {
  get: () => () => 300, // EST (UTC-5)
})

Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
  get: () => () => {
    return {
      locale: 'ru-RU',
      calendar: 'gregory',
      numberingSystem: 'latn',
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }
  },
})

// Дополнительная подмена для Intl.DateTimeFormat
Object.defineProperty(Intl, 'DateTimeFormat', {
  get: () => {
    return function (locales, options) {
      const originalFormat = new (Object.getPrototypeOf(this).constructor)(
        'ru-RU',
        {
          ...options,
          timeZone: 'America/New_York',
        }
      )
      return originalFormat
    }
  },
})

// Подмена для Date.prototype.toString чтобы показывать EST время
Object.defineProperty(Date.prototype, 'toString', {
  get: () =>
    function () {
      return this.toLocaleString('ru-RU', {
        timeZone: 'America/New_York',
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      })
    },
})
