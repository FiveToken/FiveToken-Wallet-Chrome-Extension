import Vue from 'vue'

import kyBack from './back/index'
import KyButton from './button/index'
import KyCheckbox from './checkbox/index'
import KyCheckboxGroup from './checkbox-group/index'
import KyInput from './input/index'
import KyLayout from './layout/index'
import KyHeader from './header/index'
import KyNetwork from './network/index'
import KyNoNetwork from './no-network/index'
import PasswordVerification from './password-verification/index'
import KyCanvas from './token-icon/index'
import KyProgress from './progress/index'

window.Vue = Vue
const components = [
  KyButton,
  KyInput,
  kyBack,
  KyCheckbox,
  KyCheckboxGroup,
  KyHeader,
  KyLayout,
  KyNetwork,
  KyNoNetwork,
  PasswordVerification,
  KyCanvas,
  KyProgress
]

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  KyButton,
  KyInput,
  kyBack,
  KyCheckbox,
  KyCheckboxGroup,
  KyHeader,
  KyLayout,
  KyNetwork,
  KyNoNetwork,
  PasswordVerification,
  KyCanvas,
  KyProgress
}
