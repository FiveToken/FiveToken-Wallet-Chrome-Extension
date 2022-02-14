import KyProgress from './src/index'

KyProgress.install = function (Vue) {
  Vue.component(KyProgress.name, KyProgress)
}

export default KyProgress
