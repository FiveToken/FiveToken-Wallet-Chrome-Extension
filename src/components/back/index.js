import kyBack from './src/index'

kyBack.install = function (Vue) {
  Vue.component(kyBack.name, kyBack)
}

export default kyBack
