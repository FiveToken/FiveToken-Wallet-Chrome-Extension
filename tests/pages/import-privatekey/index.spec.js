/* eslint-disable no-undef */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import importPrivatekey from '@/pages/import-privatekey/component/index.vue'
import selectNetwork from '@/pages/import-privatekey/component/select-network.vue'
import elementUI from 'element-ui'
import { Database } from '@/utils/database.js'
import Vuex from 'vuex'
const Dexie = require('dexie')
Dexie.dependencies.indexedDB = require('fake-indexeddb')
Dexie.dependencies.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange')
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
    khazix: 'khazix',
    create_time: 1631613194,
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
    khazix: 'khazix',
    networkType: 'proxy',
    filecoinAddress0: 't',
    create_time: 1631613195,
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
    khazix: 'khazix',
    networkType: 'ethereum',
    filecoinAddress0: '',
    create_time: 1631613196,
    decimals: 18,
    image: 'bnb.svg',
    disabled: true,
    deriveIndex: 0
  }
]

describe('importPrivatekey index.vue', () => {
  const assignMock = jest.fn()
  delete window.location
  window.location = { assign: assignMock }
  afterEach(() => {
    assignMock.mockClear()
  })
  const db = new Database()
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
              create_time: 1631613193,
              digest: 'zBUjeDDJuuDAPNQF',
              fil: 0,
              id: 1,
              isDelete: 0,
              khazix: 'khazix',
              privateKey: '98b983395737275c208f5b6884180cbc7575e7c208dba4621da300fc5248046ec7224a209285b4e9e770fa1e',
              rpc: 'https://api.fivetoken.io'
            }
          ],
          networks: networks
        },
        mutations: {
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
          SET_DERIVEINDEX: (state, data) => {
            state.deriveIndex = data
          }
        },
        namespaced: true
      }
    }
  })

  Object.defineProperty(window, 'location', {
    value: {
      href: './setting.html'
    }
  })

  const wrapper = shallowMount(importPrivatekey, {
    store,
    localVue,
    data () {
      return {
        customNetworkType: '',
        isFetch: false,
        networkVisible: true,
        privatekey: '7b2254797065223a22736563703235366b31222c22507269766174654b6579223a224941317956674e6e7a7a6e2f58642b7164556f6e416a4151335450677a59445a78745845616c4e563664413d227d',
        db
      }
    },
    mocks: {
      $t: key => key,
      $router: {
        go: key => key
      }
    },
    stubs: {
      'el-dialog': true
    }
  })

  // selectNetwork
  const selectNetworkCom = shallowMount(selectNetwork, {
    localVue,
    mocks: {
      $t: key => key,
      $router: {
        go: key => key
      }
    }
  })

  it('index.vue-test', async () => {
    wrapper.vm.layoutMounted()
    expect(wrapper.vm.customNetworkType).toBe('proxy')
    expect(wrapper.vm.net).toBe('https://api.fivetoken.io')
    expect(wrapper.vm.customFilecoinAddress0).toBe('f')

    const obj = {
      networkType: 'ethereum',
      filecoinAddress0: '',
      rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545'
    }
    await wrapper.vm.confirmNet(obj)
    expect(wrapper.vm.customNetworkType).toBe('ethereum')
    expect(wrapper.vm.net).toBe('https://data-seed-prebsc-1-s1.binance.org:8545')
    expect(wrapper.vm.customFilecoinAddress0).toBe('')

    await wrapper.vm.privatekeyChange('privatekey')
    expect(wrapper.vm.privatekey).toBe('privatekey')

    wrapper.vm.selectNet()
    expect(wrapper.vm.networkVisible).toBe(true)

    wrapper.vm.closeNet()
    expect(wrapper.vm.networkVisible).toBe(false)

    await wrapper.vm.importWallet()
    wrapper.vm.back()
  })

  it('selectNetwork.vue', () => {
    const obj = {
      networkType: 'ethereum',
      filecoinAddress0: '',
      rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545'
    }
    selectNetworkCom.vm.confirmNet(obj)
    selectNetworkCom.vm.closeNet()
  })
})
