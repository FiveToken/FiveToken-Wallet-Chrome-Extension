import PasswordVerification from './src/index'

PasswordVerification.install = function (Vue) {
  Vue.component(PasswordVerification.name, PasswordVerification)
}

export default PasswordVerification
