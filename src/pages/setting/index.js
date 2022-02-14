import Vue from 'vue'
import pageComponent from './component/index.vue'
import i18n from '../../i18n'
import router from '../../router'
import store from '../../store'
import { Dialog, Icon } from 'element-ui'
import Com from '../../components/index.td'
const { KyLayout, KyBack } = Com
Vue.component(KyLayout.name, KyLayout)
Vue.component(KyBack.name, KyBack)
Vue.use(Dialog)
Vue.use(Icon)
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
