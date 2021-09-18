import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from './router.config.js'

Vue.use(Router)

const createRouter = () =>
  new Router({
    mode: 'history',
    // base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
  })

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
