/* eslint-disable no-undef */
import { networks } from '@/enumeration'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import welcome from '@/pages/welcome/component/index.vue'
import elementUI from 'element-ui'
import KyLayout from '@/components/layout/index'
import KyButton from '@/components/button/index'
import Vuex from 'vuex'
const localVue = createLocalVue()
localVue.use(KyLayout)
localVue.use(KyButton)
localVue.use(Vuex)
localVue.use(elementUI)
describe('welcome index.vue', () => {
  const assignMock = jest.fn()
  delete window.location
  window.location = { assign: assignMock }
  afterEach(() => {
    assignMock.mockClear()
  })
  const store = new Vuex.Store({
    modules: {
      app: {
        state: {
          address: 'f1ntv4qlgoi55wqqxrxxolatfdgn7xvu7vfhrkcfq',
          rpc: 'https://api.fivetoken.io',
          networkType: 'proxy',
          symbol: 'FIL',
          filecoinAddress0: 'f',
          deriveIndex: 1,
          accountList: [
            {
              accountName: 'Account1',
              address: 'f1ntv4qlgoi55wqqxrxxolatfdgn7xvu7vfhrkcfq',
              createType: 'mnemonic',
              createTime: 1631613193,
              digest: 'zBUjeDDJuuDAPNQF',
              fil: 0,
              id: 1,
              privateKey: '98b983395737275c208f5b6884180cbc7575e7c208dba4621da300fc5248046ec7224a209285b4e9e770fa1e',
              rpc: 'https://api.fivetoken.io'
            }
          ],
          networks: networks
        },
        mutations: {
          SET_PRIVATEKEY: jest.fn(),
          SET_ADDRESS: jest.fn(),
          SET_DIGEST: jest.fn(),
          SET_ACCOUNTNAME: jest.fn(),
          SET_DERIVEINDEX: jest.fn()
        },
        namespaced: true
      }
    }
  })
  Object.defineProperty(window, 'location', {
    value: {
      href: './welcome.html'
    }
  })
  const wrapper = shallowMount(welcome, {
    store,
    localVue,
    data () {
      return {}
    },
    mocks: {
      $t: key => key,
      $router: {
        go: jest.fn()
      }
    },
    stubs: {
      'el-dialog': true,
      'el-input': true,
      'el-button': true
    }
  })

  it('welcome.vue-test', async () => {
    wrapper.vm.createWallet()
    const href1 = window.location.href
    expect(href1.indexOf('create-wallet')).not.toBe(-1)

    wrapper.vm.importWallet()
    const href2 = window.location.href
    expect(href2.indexOf('create-wallet')).not.toBe(-1)
  })
})
