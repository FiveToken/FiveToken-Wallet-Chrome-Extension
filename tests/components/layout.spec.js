/* eslint-disable no-undef */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import layout from '@/components/layout/src/index.vue'
import ExtensionStore from '@/utils/local-store'
import { mocksData } from '../mock.js'
const storage = {}

const localVue = createLocalVue()
localVue.use(Vuex)
const localStore = new ExtensionStore()

jest.mock('@/utils/local-store', () => (class ExtensionStore {
  get (key) {
    return mocksData[key]
  }

  set () {
    jest.fn()
  }
}))

function storageMock () {
  return {
    setItem: function (key, value) {
      storage[key] = value || ''
    },
    getItem: function (key) {
      return key in storage ? storage[key] : null
    },
    removeItem: function (key) {
      delete storage[key]
    },
    get length () {
      return Object.keys(storage).length
    },
    key: function (i) {
      const keys = Object.keys(storage)
      return keys[i] || null
    }
  }
}

describe('layout component', () => {
  let store
  let state
  let mutations
  let localStorage
  beforeEach(() => {
    state = { }
    mutations = {
      SET_ACTIVEACCOUNT: (state, data) => {
        state.activeAccount = data
      },
      SET_ONLINE: (state, data) => {
        state.onLine = data
      },
      SET_PRIVATEKEY: (state, data) => {
        state.privateKey = data
      },
      SET_ADDRESS: (state, data) => {
        state.address = data
      },
      SET_DIGEST: (state, data) => {
        state.digest = data
      },
      SET_ACCOUNTNAME: (state, data) => {
        state.accountName = data
      },
      SET_ACTIVENETWORK: (state, data) => {
        state.activeNetwork = data
      },
      SET_LANGUAGE: (state, data) => {
        state.language = data
      },
      SET_CURRENCY: (state, data) => {
        state.currency = data
      },
      SET_RPC: (state, data) => {
        state.rpc = data
      },
      SET_RPCNAME: (state, data) => {
        state.rpcName = data
      },
      SET_NETWORKS: (state, data) => {
        state.networks = data
      },
      SET_ACCOUNTLIST: (state, data) => {
        state.accountList = data
      },
      SET_SYMBOL: (state, data) => {
        state.symbol = data
      },
      SET_IDS: (state, data) => {
        state.ids = data
      },
      SET_BROWSER: (state, data) => {
        state.browser = data
      },
      SET_DERIVEINDEX: (state, data) => {
        state.deriveIndex = data
      },
      SET_NETWORKTYPE: (state, data) => {
        state.networkType = data
      },
      SET_FILECOINADDRESS0: (state, data) => {
        state.filecoinAddress0 = data
      },
      SET_DECIMALS: (state, data) => {
        state.decimals = data
      },
      SET_OWENCHAIN: (state, data) => {
        state.owenChain = data
      },
      SET_RPCIMAGE: (state, data) => {
        state.rpcImage = data
      }
    }
    store = new Vuex.Store({
      modules: {
        app: {
          state,
          mutations,
          namespaced: true
        }
      }
    })
    localStorage = storageMock()
    localStorage.setItem('fiveTokenLanguage', 'en')
    localStorage.setItem('fiveTokenCurrency', 'usd')

    localStore.set({ networks: mocksData.networks })
    localStore.set({ activeNetwork: mocksData.activeNetwork })
    localStore.set({ accountList: mocksData.accountList })
    localStore.set({ activeAccount: mocksData.activeAccount })
  })

  test('layout-test', async () => {
    const wrapper = shallowMount(layout, {
      localVue,
      store,
      mocks: {
        $t: key => [
          {
            name: 'Filcoin Mainnet',
            rpc: 'https://api.fivetoken.io',
            chainID: '',
            symbol: 'FIL',
            ids: 'filecoin',
            browser: 'https://filscan.io',
            createTime: 1631613194,
            networkType: 'proxy',
            filecoinAddress0: 'f',
            decimals: 18,
            disabled: true,
            image: 'fil.svg',
            deriveIndex: 0
          }
        ]
      }
    })

    const _activeNetwork = localStore.get('activeNetwork')
    const _networks = localStore.get('networks')

    expect(_activeNetwork).toStrictEqual(mocksData.activeNetwork)
    expect(_networks).toStrictEqual(mocksData.networks)
    expect(wrapper.html()).toContain('layout-compontent')
  })
})
