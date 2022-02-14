import Vue from 'vue'
import pageComponent from './component/index.vue'
import i18n from '../../i18n'
import router from '../../router'
import store from '../../store'
import { Checkbox, CheckboxGroup, Button, Icon, Dialog, Input } from 'element-ui'
import Com from '../../components/index.td'
const { KyLayout, KyButton } = Com
Vue.component(KyLayout.name, KyLayout)
Vue.component(KyButton.name, KyButton)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Dialog)
Vue.use(Input)
Vue.component('pageComponent', pageComponent)
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: createElement => {
    return createElement(pageComponent)
  }
})
