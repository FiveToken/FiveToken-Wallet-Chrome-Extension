/* eslint-disable no-undef */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import lockUser from '@/pages/lock-user/component/index.vue'
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
      href: './setting.html',
      search: '?mnemonicWords=robot%20sort%20steak%20cart%20banana%20bracket%20cat%20mass%20room%20success%20tackle%20rival&accountName=Account1&password=Aa123456&createType=create'
    }
  })

  const wrapper = shallowMount(lockUser, {
    store,
    localVue,
    data () {
      return {
        suffix: true,
        password: '',
        passwordType: 'password',
        localStore: null
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

  it('lock-user .vue-test', async () => {
    wrapper.vm.passwordChange('Aa123456789012346')
    const password = wrapper.vm.password
    expect(password).toBe('Aa123456789012346')

    wrapper.vm.changeEye('text')
    const passwordType = wrapper.vm.passwordType
    expect(passwordType).toBe('text')

    wrapper.vm.unlocking()
  })
})
