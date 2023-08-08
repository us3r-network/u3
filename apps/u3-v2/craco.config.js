const webpack = require('webpack')

module.exports = {
  webpack: {
    configure: (config) => {
      // Replace include option for babel loader with exclude
      // so babel will handle workspace projects as well.
      config.module.rules[1].oneOf.forEach((r) => {
        if (r.loader && r.loader.indexOf('babel') !== -1) {
          r.exclude = /node_modules/
          delete r.include
        }
      })

      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      )
      config.ignoreWarnings = [/Failed to parse source map/]
      return config
    },
  },
}
