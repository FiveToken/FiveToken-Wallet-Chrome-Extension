/* eslint-disable no-undef */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { Database } from '@/utils/database.js'
import layout from '@/components/layout/index.vue'
const Dexie = require('dexie')
Dexie.dependencies.indexedDB = require('fake-indexeddb')
Dexie.dependencies.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange')

const localVue = createLocalVue()
localVue.use(Vuex)

const networks = [
  {
    name: 'Filcoin Mainnet',
    rpc: 'https://api.fivetoken.io',
    chainID: '',
    symbol: 'FIL',
    ids: 'filecoin',
    browser: 'https://filscan.io',
    khazix: 'khazix',
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
    decimals: 18,
    image: 'bnb.svg',
    disabled: true,
    deriveIndex: 0
  }
]
const activenNetworks = {
  name: 'Filcoin Mainnet',
  rpc: 'https://api.fivetoken.io',
  chainID: '',
  symbol: 'FIL',
  ids: 'filecoin',
  browser: 'https://filscan.io',
  khazix: 'khazix',
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
  isDelete: 0,
  khazix: 'khazix',
  privateKey: 'ac9bda1e19100c4728cd5d60a5506d81330e91de7592f20716fe4cb879692536e367504ab9a684c5c378e21e',
  rpc: 'https://api.fivetoken.io'
}
const activeAccount = {
  accountName: 'Account1',
  address: 'f1q7j4pbjgfrm3jw5ct63z6kmve5u2dq4lnlm5ipi',
  createType: 'mnemonic',
  digest: '6u5t8LsDu1Y+QZkN',
  fil: 0,
  isDelete: 0,
  khazix: 'khazix',
  privateKey: 'ac9bda1e19100c4728cd5d60a5506d81330e91de7592f20716fe4cb879692536e367504ab9a684c5c378e21e',
  rpc: 'https://api.fivetoken.io'
}

function storageMock () {
  const storage = {}
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
  let db
  beforeEach(() => {
    state = { }
    mutations = {
      SET_ACTIVEACCOUNT: (state, data) => {
        state.activeAccount = data
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
      SET_ACTIVENETWORKS: (state, data) => {
        state.activenNetworks = data
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
    window.localStorage = storageMock()
    window.localStorage.setItem('fiveTokenLanguage', 'en')
    window.localStorage.setItem('fiveTokenCurrency', 'usd')
    db = new Database()
    db.bulkAddTable('networks', networks)
    db.addTable('activenNetworks', activenNetworks)
    db.addTable('accountList', accountList)
    db.addTable('activeAccount', activeAccount)
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
            khazix: 'khazix',
            create_time: 1631613194,
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
    expect(store.state.app.language).toBe('en')
    expect(store.state.app.currency).toBe('usd')
    const act = await db.getTable('activenNetworks', { khazix: 'khazix' })
    const nets = await db.getTable('networks', { khazix: 'khazix' })
    const acc = await db.getTable('accountList', { khazix: 'khazix', rpc: 'https://api.fivetoken.io' })
    const actacc = await db.getTable('activeAccount', { khazix: 'khazix' })

    for (let i = 0; i < act.length; i++) {
      delete act[i].id
      delete act[i].create_time
    }
    for (let i = 0; i < nets.length; i++) {
      delete nets[i].id
      delete nets[i].create_time
    }
    for (let i = 0; i < acc.length; i++) {
      delete acc[i].id
      delete acc[i].create_time
    }
    for (let i = 0; i < actacc.length; i++) {
      delete actacc[i].id
      delete actacc[i].create_time
    }
    expect(act).toStrictEqual([activenNetworks])
    expect(nets).toStrictEqual(networks)
    expect(acc).toStrictEqual([accountList])
    expect(actacc).toStrictEqual([activeAccount])
    expect(wrapper.html()).toContain('layout-compontent')
  })
})
