import Vue from 'vue'
import pageComponent from './component/index.vue'
import i18n from '../../i18n'
import router from '../../router'
import store from '../../store'
import { Input, Button, Icon, Progress } from 'element-ui'
import Com from '../../components/index.td'
const { KyLayout, KyBack, KyButton, KyInput, KyProgress } = Com
Vue.component(KyLayout.name, KyLayout)
Vue.component(KyBack.name, KyBack)
Vue.component(KyButton.name, KyButton)
Vue.component(KyInput.name, KyInput)
Vue.component(KyProgress.name, KyProgress)
Vue.use(Input)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Progress)
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
