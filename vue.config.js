const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require("path");
// 是否为生产环境
const isProduction = true
const pagesObj = {};

const chromeName = [
  'filecoinwallet',
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
  'filecoinwallet-connect',
  'setting-networks',
  'import-words',
  'import-privatekey',
  'account',
  'message-detail',
  'add-token',
  // 'get-web3',
  // 'update-web3'
];

chromeName.forEach(name => {
  pagesObj[name] = {
    entry: `src/pages/${name}/index.js`,
    template: "public/index.html",
    filename: `pages/${name}.html`
  };
});

const plugins = [
  {
    from: path.resolve("src/popup.js"),
    to: `${path.resolve("dist")}/popup.js`
  },
  {
    from: path.resolve("src/script-content.js"),
    to: `${path.resolve("dist")}/script-content.js`
  },
  {
    from: path.resolve("src/manifest.production.json"),
    to: `${path.resolve("dist")}/manifest.json`
  },
  {
    from: path.resolve("src/assets/image"),
    to: `${path.resolve("dist")}/assets/image`
  },
  {
    from: path.resolve("src/background.js"),
    to: `${path.resolve("dist")}/background.js`
  }
]
  
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  pages: pagesObj,
  productionSourceMap: true,
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src')),
    config.optimization.minimize(true)
    config.optimization.splitChunks({
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      cacheGroups: {
          vendors: {
              name: `chunk-vendors`,
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              chunks: 'initial'
          },
          common: {
              name: `chunk-common`,
              minChunks: 2,
              priority: -20,
              chunks: 'initial',
              reuseExistingChunk: true
          }
      }
    })
  },
  configureWebpack: {
    plugins: [
      CopyWebpackPlugin(plugins),
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },
};
