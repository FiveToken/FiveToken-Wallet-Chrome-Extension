import KyNoNetwork from './src/index'

KyNoNetwork.install = function (Vue) {
  Vue.component(KyNoNetwork.name, KyNoNetwork)
}

export default KyNoNetwork
