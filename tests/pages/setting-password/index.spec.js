/* eslint-disable no-undef */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import settingPassword from '@/pages/setting-password/component/index.vue'
import elementUI from 'element-ui'
import KyLayout from '@/components/layout/index'
import KyBack from '@/components/back/index'
import KyButton from '@/components/button/index'
import KyInput from '@/components/input/index'
import KyProgress from '@/components/progress/index'
import Vuex from 'vuex'
import { mocksData } from '../../mock'
const localVue = createLocalVue()
localVue.use(KyLayout)
localVue.use(KyBack)
localVue.use(KyButton)
localVue.use(KyInput)
localVue.use(KyProgress)
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

describe('settingPassword index.vue', () => {
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
      href: './setting-password.html'
    }
  })

  const wrapper = shallowMount(settingPassword, {
    store,
    localVue,
    data () {
      return {
        suffix: true,
        currentError: false,
        currentType: 'password',
        passwordType: 'password',
        passwordError: false,
        confirmType: 'password',
        confirmError: false,
        form: {
          currentPassword: '',
          password: '',
          confirmPassword: ''
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
      'el-dialog': true,
      'el-input': true,
      'el-button': true
    }
  })

  it('settingPassword.vue-test', async () => {
    wrapper.vm.currentEye('text')
    const currentType = wrapper.vm.passwordType
    expect(currentType).toBe('password')

    wrapper.vm.confirmEye('text')
    const confirmType = wrapper.vm.passwordType
    expect(confirmType).toBe('password')

    wrapper.vm.nameChange('Aa123456789012345')
    const currentPassword = wrapper.vm.form.currentPassword
    expect(currentPassword).toBe('Aa123456789012345')

    wrapper.vm.passwordChange('Aa123456789012346')
    const password = wrapper.vm.form.password
    expect(password).toBe('Aa123456789012346')

    wrapper.vm.confirmChange('Aa123456789012346')
    const confirmPassword = wrapper.vm.form.confirmPassword
    expect(confirmPassword).toBe('Aa123456789012346')

    wrapper.vm.passwordEye('text')
    const passwordType = wrapper.vm.passwordType
    expect(passwordType).toBe('text')

    wrapper.vm.reset()
    const diff = wrapper.vm.diff
    expect(diff).toBe(false)

    wrapper.vm.createWallet()
    const href1 = window.location.href
    expect(href1.indexOf('create-wallet')).not.toBe(-1)

    wrapper.vm.importWallet()
    const href2 = window.location.href
    expect(href2.indexOf('create-wallet')).not.toBe(-1)

    wrapper.vm.back()
    const href3 = window.location.href
    expect(href3.indexOf('setting')).not.toBe(-1)

    wrapper.vm.create()
  })
})