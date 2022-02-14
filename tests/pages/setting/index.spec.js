/* eslint-disable no-undef */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import setting from '@/pages/setting/component/index.vue'
import elementUI from 'element-ui'
import ExtensionStore from '@/utils/local-store'
import KyLayout from '@/components/layout/index'
import KyBack from '@/components/back/index'
import KyButton from '@/components/button/index'
import KyInput from '@/components/input/index'
import Vuex from 'vuex'
import { mocksData } from '../../mock'
const localVue = createLocalVue()
localVue.use(KyLayout)
localVue.use(KyBack)
localVue.use(KyButton)
localVue.use(KyInput)
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
    createTime: 1631613194,
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
    createTime: 1631613195,
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
    createTime: 1631613196,
    decimals: 18,
    image: 'bnb.svg',
    disabled: true,
    deriveIndex: 0
  }
]
jest.mock('@/utils/local-store', () => (class ExtensionStore {
  get (key) {
    return mocksData[key]
  }

  set () {
    jest.fn()
  }
}))

describe('setting index.vue', () => {
  let localStore
  const assignMock = jest.fn()
  delete window.location
  window.location = { assign: assignMock }
  afterEach(() => {
    assignMock.mockClear()
  })
  beforeEach(() => {
    localStore = new ExtensionStore()
  })
  const store = new Vuex.Store({
    modules: {
      app: {
        state: {
          address: 'f1ntv4qlgoi55wqqxrxxolatfdgn7xvu7vfhrkcfq',
          privateKey: '98b983395737275c208f5b6884180cbc7575e7c208dba4621da300fc5248046ec7224a209285b4e9e770fa1e',
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
          activeAccount: {
            accountName: 'Account1',
            address: 'f1q7j4pbjgfrm3jw5ct63z6kmve5u2dq4lnlm5ipi',
            createType: 'mnemonic',
            digest: '6u5t8LsDu1Y+QZkN',
            fil: 0,
            privateKey: 'ac9bda1e19100c4728cd5d60a5506d81330e91de7592f20716fe4cb879692536e367504ab9a684c5c378e21e',
            rpc: 'https://api.fivetoken.io'
          },
          networks: networks
        },
        mutations: {
          SET_PRIVATEKEY: jest.fn(),
          SET_ADDRESS: jest.fn(),
          SET_DIGEST: jest.fn(),
          SET_ACCOUNTNAME: jest.fn(),
          SET_DERIVEINDEX: jest.fn(),
          SET_ACTIVEACCOUNT: jest.fn(),
          SET_CURRENCY: jest.fn()
        },
        getters: {
          sortedAccountList: state => state.accountList
        },
        namespaced: true
      }
    }
  })

  Object.defineProperty(window, 'location', {
    value: {
      href: './setting.html',
      search: '?'
    }
  })

  const wrapper = shallowMount(setting, {
    store,
    localVue,
    data () {
      return {
        createType: '',
        currencyVisible: false,
        languageVisible: false,
        localStore
      }
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

  it('setting .vue-test', async () => {
    // await wrapper.vm.layoutMounted()

    // wrapper.vm.lockUser()
    // const href = window.location.href
    // expect(href.indexOf('fiveToken')).not.toBe(-1)

    // wrapper.vm.changeAccount()
    // const href1 = window.location.href
    // expect(href1.indexOf('account')).not.toBe(-1)
    //
    // wrapper.vm.createWallet()
    // const href2 = window.location.href
    // expect(href2.indexOf('add-account')).not.toBe(-1)
    //
    // wrapper.vm.importWallet()
    // const href3 = window.location.href
    // expect(href3.indexOf('import-privatekey')).not.toBe(-1)
    //
    // wrapper.vm.toSetting()
    // const href4 = window.location.href
    // expect(href4.indexOf('setting')).not.toBe(-1)
    //
    wrapper.vm.currencyChange('usd')
    wrapper.vm.currencyClose()
    // wrapper.vm.languageChange('en')
    wrapper.vm.languageClose()

    wrapper.vm.back()
    const href5 = window.location.href
    expect(href5.indexOf('wallet')).not.toBe(-1)
  })
})
