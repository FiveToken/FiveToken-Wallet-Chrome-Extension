import KyCanvas from './src/index'

KyCanvas.install = function (Vue) {
  Vue.component(KyCanvas.name, KyCanvas)
}

export default KyCanvas
