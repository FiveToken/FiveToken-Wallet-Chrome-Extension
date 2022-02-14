import KyButton from './src/index'

KyButton.install = function (Vue) {
  Vue.component(KyButton.name, KyButton)
}

export default KyButton
