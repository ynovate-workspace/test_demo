const webpack = require('webpack')

module.exports = function override (config) {
  const fallback = config.resolve.fallback || {
    // Mock out the NodeFS module: The opus decoder imports this wrongly.
    fs: false,
    net: false,
    tls: false,
    crypto: false,

    // Polyfill needed by sentry
    'process/browser': require.resolve('process/browser')
  }
  Object.assign(fallback, {
    assert: require.resolve('assert')
  })
  config.resolve.fallback = fallback

  // Configure webpack to ignore specific warnings
  config.ignoreWarnings = [/Failed to parse source map/]

  // This is deprecated in webpack 5 but alias false does not seem to work
  config.module.rules.push({
    test: /node_modules[\\\/]https-proxy-agent[\\\/]/,
    use: 'null-loader'
  })
  return config
}
