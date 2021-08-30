import Vue from "vue";
import pageComponent from "./component/index.vue";
import i18n from '@/i18n'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from '@/router'
import store from '@/store'

Vue.use(ElementUI);
Vue.component("pageComponent", pageComponent);

new Vue({
  el: "#app",
  i18n,
  router,
  store,
  render: createElement => {
    return createElement(pageComponent);
  }
});
