/* eslint-disable no-undef */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import fiveToken from '@/pages/fiveToken/component/index.vue'
import Vuex from 'vuex'
const localVue = createLocalVue()
localVue.use(Vuex)
describe('account index.vue', () => {
  const store = new Vuex.Store({
    modules: {
      app: {
        state: {},
        mutations: {},
        namespaced: true
      }
    }
  })

  const wrapper = shallowMount(fiveToken, {
    store,
    localVue,
    mocks: {
      $t: key => key
    }
  })

  it('index.vue-test', async () => {
    expect(wrapper.html()).toContain('fivetoken-page')
  })
})
