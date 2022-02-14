import Vue from 'vue'
import pageComponent from './component/index.vue'
import i18n from '../../i18n'
import router from '../../router'
import store from '../../store'
import { Button, Icon, Input, Message, Progress } from 'element-ui'
import Com from '../../components/index.td'
const { KyLayout, KyButton, KyBack, KyInput, KyProgress } = Com
Vue.component(KyLayout.name, KyLayout)
Vue.component(KyButton.name, KyButton)
Vue.component(KyBack.name, KyBack)
Vue.component(KyInput.name, KyInput)
Vue.component(KyProgress.name, KyProgress)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Input)
Vue.use(Progress)
Vue.component('pageComponent', pageComponent)
Vue.prototype.$message = Message
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
