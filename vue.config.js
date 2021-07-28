const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require("path");
const isProduction = true
const pagesObj = {};

const chromeName = [
  'filecoinwallet',
  'welcome', 
  'first-wallet',
  'import-wallet',
  'create-wallet',
  'create-words',
  'check-words',
  'create-success',
  'wallet',
  'send-fil',
  'setting',
  'setting-currency',
  'setting-address',
  'setting-backups',
  'setting-about',
  'lock-user',
  'filecoinwallet-connect'
];




chromeName.forEach(name => {
  pagesObj[name] = {
    entry: `src/pages/${name}/index.js`,
    template: "public/index.html",
    filename: `pages/${name}.html`
  };
});

const plugins =
  process.env.NODE_ENV === "production"
    ? [
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
        },
        {
          from: path.resolve("src/db.js"),
          to: `${path.resolve("dist")}/db.js`
        },
        {
          from: path.resolve("src/dexie.js"),
          to: `${path.resolve("dist")}/dexie.js`
        }
      ]
    : [
        {
          from: path.resolve("src/popup.js"),
          to: `${path.resolve("dist")}/popup.js`
        },
        {
          from: path.resolve("src/script-content.js"),
          to: `${path.resolve("dist")}/script-content.js`
        },
        {
          from: path.resolve("src/utils/hot-reload.js"),
          to: `${path.resolve("dist")}/hot-reload.js`
        },
        {
          from: path.resolve("src/manifest.development.json"),
          to: `${path.resolve("dist")}/manifest.json`
        },
        {
          from: path.resolve("src/assets/image"),
          to: `${path.resolve("dist")}/assets/image`
        },
        {
          from: path.resolve("src/background.js"),
          to: `${path.resolve("dist")}/background.js`
        },
        {
          from: path.resolve("src/db.js"),
          to: `${path.resolve("dist")}/db.js`
        },
        {
          from: path.resolve("src/dexie.js"),
          to: `${path.resolve("dist")}/dexie.js`
        }
      ];
      function resolve(dir) {
        return path.join(__dirname, dir)
      }

module.exports = {
  pages: pagesObj,
  productionSourceMap: false,
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
