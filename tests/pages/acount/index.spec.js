/* eslint-disable no-undef */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import accountIndex from '@/pages/account/component/index.vue'
import add from '@/pages/account/component/add.vue'
import { Database } from '@/utils/database.js'
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

describe('account index.vue', () => {
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
          address: 'f1dq4lt3tbnp5pcwqfbot5yjwdssqg7pqcfcv6yoy',
          rpc: 'https://api.fivetoken.io',
          networkType: 'proxy',
          symbol: 'FIL',
          filecoinAddress0: 'f',
          deriveIndex: 1,
          privateKey: '979ddd2360353a7b0bc7473e9f0c74a6200fb9c87ec19c67769b66ab5b76240dd0267157bc9a9fd49e73cc1e',
          accountList: [
            {
              accountName: 'Account1',
              address: 'f1dq4lt3tbnp5pcwqfbot5yjwdssqg7pqcfcv6yoy',
              createType: 'mnemonic',
              create_time: 1631613193,
              digest: 'zBUjeDDJuuDAPNQF',
              fil: 0,
              id: 1,
              isDelete: 0,
              khazix: 'khazix',
              privateKey: '979ddd2360353a7b0bc7473e9f0c74a6200fb9c87ec19c67769b66ab5b76240dd0267157bc9a9fd49e73cc1e',
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

  const addComponent = shallowMount(add, {
    propsData: {
      addName: ''
    },
    computed: {
      active () {
        return true
      }
    },
    mocks: {
      $t: key => key
    }
  })

  const wrapper = shallowMount(accountIndex, {
    store,
    localVue,
    data () {
      return {
        activeF1: {},
        ethereumF1: {},
        calibrationF1: {},
        filecoinF1: {},
        addAccountVisable: true,
        db,
        mneAccount: [],
        pkAccount: []
      }
    },
    mocks: {
      $t: key => key,
      $router: {
        go: key => key
      }
    },
    stubs: {
      'el-dialog': true,
      'el-input': true,
      'el-button': true
    }

  })

  it('add.vue - test', () => {
    const close = addComponent.find('.close')
    close.trigger('click')
    addComponent.vm.changeInput(1)
    addComponent.vm.confirmAdd()
  })

  it('index.vue-test', async () => {
    const lock = wrapper.find('.lock')
    lock.trigger('click')
    await wrapper.vm.confirmAdd()
    await wrapper.vm.layoutMounted()

    // const obj = {
    //   address: 'f1ntv4qlgoi55wqqxrxxolatfdgn7xvu7vfhrkcfq',
    //   accountName: 'Account2',
    //   privateKey: '98b983395737275c208f5b6884180cbc7575e7c208dba4621da300fc5248046ec7224a209285b4e9e770fa1e',
    //   digest: 'zBUjeDDJuuDAPNQF',
    //   createType: 'mnemonic',
    //   create_time: 1631613193,
    //   rpc: 'https://api.fivetoken.io'
    // }
    // wrapper.vm.changeAccount(obj)
    // const changeAccountHref = window.location.href
    // expect(store.state.app.address).toBe('f1ntv4qlgoi55wqqxrxxolatfdgn7xvu7vfhrkcfq')
    // expect(store.state.app.digest).toBe('zBUjeDDJuuDAPNQF')
    // expect(store.state.app.privateKey).toBe('98b983395737275c208f5b6884180cbc7575e7c208dba4621da300fc5248046ec7224a209285b4e9e770fa1e')
    // expect(store.state.app.accountName).toBe('Account2')
    // expect(changeAccountHref).toBe('./wallet.html')

    await wrapper.vm.lockUser()
    const lockUserHref = window.location.href
    expect(lockUserHref).toBe('./fiveToken.html')

    await wrapper.vm.createWallet()
    wrapper.vm.closeAdd()
    const addAccountVisable = wrapper.vm.addAccountVisable
    expect(addAccountVisable).toBe(false)
    wrapper.vm.back()
    const back = wrapper.vm.$router.go(-1)
    expect(back).toBe(-1)
    wrapper.vm.toSetting()
    const setHref = window.location.href
    expect(setHref).toBe('./setting.html')
    wrapper.vm.importWallet()
    const importWalletHref = window.location.href
    expect(importWalletHref).toBe('./import-privatekey.html')
  })
})
