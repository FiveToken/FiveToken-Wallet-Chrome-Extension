import KyLayout from './src/index'

KyLayout.install = function (Vue) {
  Vue.component(KyLayout.name, KyLayout)
}

export default KyLayout
