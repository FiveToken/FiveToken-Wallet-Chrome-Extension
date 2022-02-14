/* eslint-disable no-undef */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import ExtensionStore from '@/utils/local-store'
import kyNetwork from '@/components/network/src/index.vue'
import { mocksData } from '../mock'
import elementUI from 'element-ui'
const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(elementUI)

const networks = [
  {
    name: 'Filcoin Mainnet',
    rpc: 'https://api.fivetoken.io',
    chainID: '',
    symbol: 'FIL',
    ids: 'filecoin',
    browser: 'https://filscan.io',
    networkType: 'proxy',
    filecoinAddress0: 'f',
    decimals: 18,
    disabled: true,
    image: 'fil.svg',
    deriveIndex: 0
  },
  {
    name: 'Filecoin Calibration Testnet',
    rpc: 'https://api.calibration.fivetoken.io',
    chainID: '',
    symbol: 'FIL',
    ids: 'filecoin',
    browser: 'https://calibration.filscan.io',
    networkType: 'proxy',
    filecoinAddress0: 't',
    decimals: 18,
    image: 'fil.svg',
    disabled: true,
    deriveIndex: 0
  },
  {
    name: 'Binance TEST',
    rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    chainID: '56',
    symbol: 'BNB',
    ids: 'binancecoin',
    browser: 'https://testnet.bscscan.com',
    networkType: 'ethereum',
    filecoinAddress0: '',
    decimals: 18,
    image: 'bnb.svg',
    disabled: true,
    deriveIndex: 0
  }
]
const activeNetwork = {
  name: 'Filcoin Mainnet',
  rpc: 'https://api.fivetoken.io',
  chainID: '',
  symbol: 'FIL',
  ids: 'filecoin',
  browser: 'https://filscan.io',
  networkType: 'proxy',
  filecoinAddress0: 'f',
  decimals: 18,
  disabled: true,
  image: 'fil.svg',
  deriveIndex: 0
}
const accountList = {
  accountName: 'Account1',
  address: 'f1q7j4pbjgfrm3jw5ct63z6kmve5u2dq4lnlm5ipi',
  createType: 'mnemonic',
  digest: '6u5t8LsDu1Y+QZkN',
  fil: 0,
  privateKey: 'ac9bda1e19100c4728cd5d60a5506d81330e91de7592f20716fe4cb879692536e367504ab9a684c5c378e21e',
  rpc: 'https://api.fivetoken.io'
}
const activeAccount = {
  accountName: 'Account1',
  address: 'f1q7j4pbjgfrm3jw5ct63z6kmve5u2dq4lnlm5ipi',
  createType: 'mnemonic',
  digest: '6u5t8LsDu1Y+QZkN',
  fil: 0,
  privateKey: 'ac9bda1e19100c4728cd5d60a5506d81330e91de7592f20716fe4cb879692536e367504ab9a684c5c378e21e',
  rpc: 'https://api.fivetoken.io'
}

jest.mock('@/utils/local-store', () => (class ExtensionStore {
  get (key) {
    return mocksData[key]
  }

  set () {
    jest.fn()
  }
}))

describe('network component', () => {
  let store
  let state
  let mutations
  let localStore
  const assignMock = jest.fn()
  delete window.location
  window.location = { assign: assignMock }
  afterEach(() => {
    assignMock.mockClear()
  })
  beforeEach(() => {
    localStore = new ExtensionStore()
    localStore.set({ networks: networks })
    localStore.set({ activeNetwork: activeNetwork })
    localStore.set({ accountList: accountList })
    localStore.set({ activeAccount: activeAccount })

    state = {
      address: () => 'f1ntv4qlgoi55wqqxrxxolatfdgn7xvu7vfhrkcfq',
      networkType: () => 'proxy',
      networks: () => networks,
      activeAccount: []
    }
    mutations = {
      SET_ADDRESS: (state, data) => {
        state.address = data
      },
      SET_ACCOUNTNAME: (state, data) => {
        state.accountName = data
      },
      SET_PRIVATEKEY: (state, data) => {
        state.privateKey = data
      },
      SET_DIGEST: (state, data) => {
        state.digest = data
      },
      SET_ACTIVETWORKS: (state, data) => {
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
      },
      SET_ACTIVEACCOUNT: (state, data) => {
        state.activeAccount = data
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
  })
  Object.defineProperty(window, 'location', {
    value: {
      href: './welcome.html'
    }
  })
  test('network-test', async () => {
    const wrapper = shallowMount(kyNetwork, {
      localVue,
      store,
      mocks: {
        $t: key => key,
        chrome: {
          runtime: {
            onMessage: {
              addListener: jest.fn()
            }
          }
        }
      },
      data () {
        return {
          localStore
        }
      },
      stubs: {
        'el-message': true
      }
    })
    expect(wrapper.html()).toContain('select-network-component')
    const close = wrapper.find('.close')
    close.trigger('click')
    const customItem = wrapper.find('.custom-item')
    customItem.trigger('click')
    const customHref = window.location.href
    expect(customHref).toBe('./setting-networks.html')

    const acc = {
      address: 'f1ntv4qlgoi55wqqxrxxolatfdgn7xvu7vfhrkcfq',
      accountName: 'Account2',
      privateKey: '98b983395737275c208f5b6884180cbc7575e7c208dba4621da300fc5248046ec7224a209285b4e9e770fa1e',
      digest: 'zBUjeDDJuuDAPNQF',
      createType: 'mnemonic',
      createTime: 1631613193,
      rpc: 'https://api.fivetoken.io'
    }
    await wrapper.vm.changeAccount(acc)
    expect(store.state.app.address).toBe('f1ntv4qlgoi55wqqxrxxolatfdgn7xvu7vfhrkcfq')

    const obj = {
      name: 'Binance TEST',
      rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainID: '56',
      symbol: 'BNB',
      ids: 'binancecoin',
      browser: 'https://testnet.bscscan.com',
      networkType: 'ethereum',
      filecoinAddress0: '',
      decimals: 18,
      image: 'bnb.svg',
      disabled: true,
      deriveIndex: 0
    }
    await wrapper.vm.changeNetwork(obj)
    expect(obj.rpc).toBe('https://data-seed-prebsc-1-s1.binance.org:8545')
  })
})

// test('ethers ', async () => {
//   const string = 'hello'
//   expect(string).toBe('hello')
// })
