import KyHeader from './src/index'

KyHeader.install = function (Vue) {
  Vue.component(KyHeader.name, KyHeader)
}

export default KyHeader
