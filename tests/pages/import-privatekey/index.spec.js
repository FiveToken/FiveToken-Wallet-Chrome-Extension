/* eslint-disable no-undef */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import importPrivatekey from '@/pages/import-privatekey/component/index.vue'
import elementUI from 'element-ui'
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
      href: './setting.html'
    }
  })

  const wrapper = shallowMount(importPrivatekey, {
    store,
    localVue,
    data () {
      return {
        isFetch: false,
        networkVisible: true,
        privatekey: '7b2254797065223a22736563703235366b31222c22507269766174654b6579223a224941317956674e6e7a7a6e2f58642b7164556f6e416a4151335450677a59445a78745845616c4e563664413d227d',
        db: {
          addTable: jest.fn(),
          getTable: jest.fn(),
          bulkAddTable: jest.fn(),
          bulkPutTable: jest.fn(),
          modifyTable: jest.fn(),
          deleteTable: jest.fn(),
          clearTable: jest.fn()
        }
      }
    },
    mocks: {
      $t: key => key,
      $router: {
        go: jest.fn()
      }
    },
    stubs: {
      'el-dialog': true
    }
  })

  it('index.vue-test', async () => {
    wrapper.vm.layoutMounted()
    const obj = {
      networkType: 'proxy',
      filecoinAddress0: 'f',
      rpc: 'https://api.fivetoken.io'
    }
    await wrapper.vm.confirmNet(obj)
    await wrapper.vm.privatekeyChange()
    wrapper.vm.selectNet()
    wrapper.vm.closeNet()
    await wrapper.vm.importWallet()
    wrapper.vm.back()
  })
})
