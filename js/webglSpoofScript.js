;(function () {
  'use strict'

  // Логические пары vendor-renderer для избежания несоответствий
  const webglPairs = [
    // Intel пары
    {
      vendor: 'Google Inc. (Intel)',
      renderer:
        'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    },
    {
      vendor: 'Google Inc. (Intel)',
      renderer:
        'ANGLE (Intel, Intel(R) HD Graphics 4000 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    },
    {
      vendor: 'Google Inc. (Intel)',
      renderer:
        'ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)',
    },
    {
      vendor: 'Google Inc. (Intel)',
      renderer:
        'ANGLE (Intel, Intel(R) HD Graphics 5500 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    },

    // AMD пары
    {
      vendor: 'Google Inc. (AMD)',
      renderer:
        'ANGLE (AMD, AMD Radeon RX 580 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    },
    {
      vendor: 'Google Inc. (AMD)',
      renderer:
        'ANGLE (AMD, AMD Radeon RX 6600 XT Direct3D11 vs_5_0 ps_5_0, D3D11)',
    },
    {
      vendor: 'Google Inc. (AMD)',
      renderer:
        'ANGLE (AMD, AMD Radeon RX 5700 XT Direct3D11 vs_5_0 ps_5_0, D3D11)',
    },
    {
      vendor: 'Google Inc. (AMD)',
      renderer:
        'ANGLE (AMD, AMD Radeon RX 7800 XT Direct3D11 vs_5_0 ps_5_0, D3D11)',
    },

    // NVIDIA пары
    {
      vendor: 'Google Inc. (NVIDIA)',
      renderer:
        'ANGLE (NVIDIA, NVIDIA GeForce GTX 1060 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    },
    {
      vendor: 'Google Inc. (NVIDIA)',
      renderer:
        'ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    },
    {
      vendor: 'Google Inc. (NVIDIA)',
      renderer:
        'ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Ti Direct3D11 vs_5_0 ps_5_0, D3D11)',
    },
    {
      vendor: 'Google Inc. (NVIDIA)',
      renderer:
        'ANGLE (NVIDIA, NVIDIA GeForce GTX 1660 Ti Direct3D11 vs_5_0 ps_5_0, D3D11)',
    },
    {
      vendor: 'Google Inc. (NVIDIA)',
      renderer:
        'ANGLE (NVIDIA, NVIDIA GeForce RTX 2060 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    },
  ]

  // Генерируем случайные значения для сессии
  const sessionSeed = Math.random()
  function seededRandom(seed) {
    return ((seed * 9301 + 49297) % 233280) / 233280
  }

  const selectedPair =
    webglPairs[Math.floor(seededRandom(sessionSeed) * webglPairs.length)]
  const selectedVendor = selectedPair.vendor
  const selectedRenderer = selectedPair.renderer

  // Сохраняем оригинальные методы
  const originalGetContext = HTMLCanvasElement.prototype.getContext
  const originalGetParameter = WebGLRenderingContext.prototype.getParameter
  const originalGetExtension = WebGLRenderingContext.prototype.getExtension

  // Также для WebGL2
  if (window.WebGL2RenderingContext) {
    const originalGetParameter2 = WebGL2RenderingContext.prototype.getParameter
    const originalGetExtension2 = WebGL2RenderingContext.prototype.getExtension

    // Перехватываем getParameter для WebGL2
    WebGL2RenderingContext.prototype.getParameter = function (parameter) {
      if (parameter === this.VENDOR) {
        return selectedVendor
      }
      if (parameter === this.RENDERER) {
        return selectedRenderer
      }
      return originalGetParameter2.call(this, parameter)
    }

    // Перехватываем getExtension для WebGL2
    WebGL2RenderingContext.prototype.getExtension = function (name) {
      const ext = originalGetExtension2.call(this, name)
      if (name === 'WEBGL_debug_renderer_info' && ext) {
        // Перехватываем методы расширения
        const originalGetParam = this.getParameter.bind(this)
        this.getParameter = function (param) {
          if (param === ext.UNMASKED_VENDOR_WEBGL) {
            return selectedVendor
          }
          if (param === ext.UNMASKED_RENDERER_WEBGL) {
            return selectedRenderer
          }
          return originalGetParam(param)
        }
      }
      return ext
    }
  }

  // Перехватываем getParameter для WebGL
  WebGLRenderingContext.prototype.getParameter = function (parameter) {
    if (parameter === this.VENDOR) {
      return selectedVendor
    }
    if (parameter === this.RENDERER) {
      return selectedRenderer
    }
    return originalGetParameter.call(this, parameter)
  }

  // Перехватываем getExtension для WebGL
  WebGLRenderingContext.prototype.getExtension = function (name) {
    const ext = originalGetExtension.call(this, name)
    if (name === 'WEBGL_debug_renderer_info' && ext) {
      // Перехватываем методы расширения
      const originalGetParam = this.getParameter.bind(this)
      this.getParameter = function (param) {
        if (param === ext.UNMASKED_VENDOR_WEBGL) {
          return selectedVendor
        }
        if (param === ext.UNMASKED_RENDERER_WEBGL) {
          return selectedRenderer
        }
        return originalGetParam(param)
      }
    }
    return ext
  }

  // Перехватываем getContext для применения подмены
  HTMLCanvasElement.prototype.getContext = function (
    contextType,
    contextAttributes
  ) {
    const context = originalGetContext.call(
      this,
      contextType,
      contextAttributes
    )

    if (
      context &&
      (contextType === 'webgl' ||
        contextType === 'webgl2' ||
        contextType === 'experimental-webgl')
    ) {
      // Применяем подмену к контексту
      const originalGetParam = context.getParameter.bind(context)
      context.getParameter = function (parameter) {
        if (parameter === context.VENDOR) {
          return selectedVendor
        }
        if (parameter === context.RENDERER) {
          return selectedRenderer
        }
        return originalGetParam(parameter)
      }

      const originalGetExt = context.getExtension.bind(context)
      context.getExtension = function (name) {
        const ext = originalGetExt(name)
        if (name === 'WEBGL_debug_renderer_info' && ext) {
          // Перехватываем параметры расширения
          const origGetParam = context.getParameter.bind(context)
          context.getParameter = function (param) {
            if (param === ext.UNMASKED_VENDOR_WEBGL) {
              return selectedVendor
            }
            if (param === ext.UNMASKED_RENDERER_WEBGL) {
              return selectedRenderer
            }
            return origGetParam(param)
          }
        }
        return ext
      }
    }

    return context
  }
})()
