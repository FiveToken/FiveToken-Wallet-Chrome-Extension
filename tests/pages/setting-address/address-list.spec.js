/* eslint-disable no-undef */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import addressList from '@/pages/setting-address/component/address-list.vue'
import elementUI from 'element-ui'
import Vuex from 'vuex'
import KyLayout from '@/components/layout/index'
import KyBack from '@/components/back/index'
import KyButton from '@/components/button/index'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import zhmsg from '@/lang/zh'
import enmsg from '@/lang/en'
import { mocksData } from '../../mock'
const localVue = createLocalVue()
localVue.use(VueI18n)
const messages = {
  en: {
    ...enmsg,
    ...enLocale
  },
  zh: {
    ...zhmsg,
    ...zhLocale
  }
}

const i18n = new VueI18n({
  locale: 'zh',
  messages, // set locale messages
  silentTranslationWarn: true
})
window.$i18n = i18n
localVue.$i18n = i18n
localVue.use(KyLayout)
localVue.use(KyBack)
localVue.use(KyButton)
localVue.use(Vuex)
// 这里全部注册element：解决报错2
localVue.use(elementUI, {
  i18n: function (path, options) {
    const value = i18n.t(path, options)
    if (value !== null && value !== undefined) return value
    return ''
  }
})
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

describe('account index.vue', () => {
  const assignMock = jest.fn()
  delete window.location
  window.location = { assign: assignMock }
  localVue.$i18n = i18n
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
      href: './setting-address.html',
      search: '?to=f1ipv4zxpdl47c6clbixbxsdpc7a6d6hf5l77ykhq'
    }
  })

  const wrapper = shallowMount(addressList, {
    store,
    localVue,
    i18n,
    data () {
      return {
        version: ''
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

  it('addressList .vue-test', async () => {
    wrapper.vm.changeSearch('address')
    wrapper.vm.addAddress()

    const href = window.location.href
    expect(href.indexOf('setting-address')).not.toBe(-1)
    wrapper.vm.closeSetting()

    wrapper.vm.back()
    const href2 = window.location.href
    expect(href2.indexOf('setting')).not.toBe(-1)
  })
})
