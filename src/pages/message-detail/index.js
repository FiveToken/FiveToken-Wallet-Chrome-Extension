import Vue from 'vue'
import pageComponent from './component/index.vue'
import i18n from '../../i18n'
import router from '../../router'
import store from '../../store'
// eslint-disable-next-line no-new
import { Message, Icon } from 'element-ui'
Vue.use(Icon)
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
