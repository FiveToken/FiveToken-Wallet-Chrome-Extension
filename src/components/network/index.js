import kyNetwork from './src/index'

kyNetwork.install = function (Vue) {
  Vue.component(kyNetwork.name, kyNetwork)
}

export default kyNetwork
