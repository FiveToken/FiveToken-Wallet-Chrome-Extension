import Vue from 'vue'
import pageComponent from './component/index.vue'
import i18n from '../../i18n'
import router from '../../router'
import store from '../../store'
import { Input, Icon, Message, Dialog, Button } from 'element-ui'
import Com from '../../components/index.td'
const { KyLayout, KyBack, KyButton, KyInput } = Com
Vue.component(KyLayout.name, KyLayout)
Vue.component(KyBack.name, KyBack)
Vue.component(KyButton.name, KyButton)
Vue.component(KyInput.name, KyInput)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Button)
Vue.use(Icon)
Vue.prototype.$message = Message
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
