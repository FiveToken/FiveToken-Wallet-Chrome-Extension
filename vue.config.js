/* eslint-disable no-unused-vars */
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const pagesObj = {}
const jsObj = {}
const chromeName = [
  'fiveToken',
  'welcome',
  'create-wallet',
  'create-words',
  'check-words',
  'wallet',
  'send-fil',
  'setting',
  'setting-address',
  'setting-backups',
  'setting-about',
  'lock-user',
  'fiveToken-connect',
  'setting-networks',
  'setting-password',
  'import-words',
  'import-privatekey',
  'account',
  'message-detail',
  'add-token',
  'add-account',
  'custom-send-transaction'
]

const jsName = [
  'content-script',
  'popup',
  'background'
]

chromeName.forEach(name => {
  pagesObj[name] = {
    entry: `src/pages/${name}/index.js`,
    template: 'public/index.html',
    filename: `pages/${name}.html`
  }
})

jsName.forEach(name => {
  jsObj[name] = {
    entry: `src/${name}.js`,
    filename: `pages/${name}.html`
  }
})

const plugins = [
  {
    from: path.resolve('src/assets/style/common.css'),
    to: `${path.resolve('dist')}/css/common.css`
  },
  {
    from: path.resolve('src/assets/image'),
    to: `${path.resolve('dist')}/img`
  },
  {
    from: path.resolve('src/inject.js'),
    to: `${path.resolve('dist')}/js/inject.js`
  },
  {
    from: path.resolve('src/manifest.json'),
    to: `${path.resolve('dist')}/manifest.json`
  }
]

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  pages: {
    ...pagesObj,
    ...jsObj
  },
  productionSourceMap: true,
  filenameHashing: false,
  configureWebpack: {
    devtool: 'cheap-module-source-map',
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            name: 'chunk-vendors',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 30000,
            priority: 100
          }
        }
      }
    },
    plugins: [
      new CopyWebpackPlugin(plugins)
    ]
  }
}
