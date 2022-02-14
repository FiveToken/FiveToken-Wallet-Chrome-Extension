/* eslint-disable no-undef */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import importWords from '@/pages/import-words/component/index.vue'
import elementUI from 'element-ui'
import KyLayout from '@/components/layout/index'
import KyBack from '@/components/back/index'
import KyButton from '@/components/button/index'
import KyInput from '@/components/input/index'
import Vuex from 'vuex'
import { mocksData } from '../../mock'
const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(elementUI)
localVue.use(KyLayout)
localVue.use(KyBack)
localVue.use(KyButton)
localVue.use(KyInput)
jest.useFakeTimers()
jest.spyOn(global, 'setTimeout')
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

describe('importWords index.vue', () => {
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
      href: './import-words.html',
      search: '?accountName=Account1&password=%40Aa123456789012zpc&createType=importWords&sourceType=recovery'
    }
  })

  const wrapper = shallowMount(importWords, {
    store,
    localVue,
    data () {
      return {
        loading: require('@/assets/image/loading.png'),
        show: false,
        agree: false,
        isFetch: false,
        form: {
          mnemonicWords: '',
          accountName: '',
          password: ''
        },
        error: false,
        sourceType: ''
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

  it('index.vue-test', async () => {
    wrapper.vm.layoutMounted()

    const words = 'vintage about dice wagon border labor toy property correct credit digital drum'
    wrapper.vm.mnemonicWordsChange(words)
    expect(wrapper.vm.form.mnemonicWords).toBe(words)

    const accountName = wrapper.vm.getQuery('accountName')
    expect(accountName).toBe('Account1')

    await wrapper.vm.importWallet()
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 0)
    wrapper.vm.focus()
    expect(wrapper.vm.error).toBe(false)

    await wrapper.vm.back()
    wrapper.vm.back()
    const back = wrapper.vm.$router.go(-1)
    expect(back).toBe(-1)
  })
})
