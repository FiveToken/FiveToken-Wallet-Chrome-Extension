import Vue from 'vue'
import pageComponent from './component/index.vue'
import i18n from '../../i18n'
import router from '../../router'
import store from '../../store'
import { Input, Dialog, Icon, Button, Message, Collapse, CollapseItem, Popover } from 'element-ui'
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Button)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Popover)
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
