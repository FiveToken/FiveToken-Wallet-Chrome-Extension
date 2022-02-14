/* eslint-disable no-undef */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import settingAbout from '@/pages/setting-about/component/index.vue'
import elementUI from 'element-ui'
import Vuex from 'vuex'
import KyLayout from '@/components/layout/index'
import KyBack from '@/components/back/index'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import zhmsg from '@/lang/zh'
import enmsg from '@/lang/en'
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

describe('account index.vue', () => {
  const assignMock = jest.fn()
  delete window.location
  window.location = { assign: assignMock }
  // localVue.$i18n = i18n
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
      href: './setting.html',
      search: '?mnemonicWords=robot%20sort%20steak%20cart%20banana%20bracket%20cat%20mass%20room%20success%20tackle%20rival&accountName=Account1&password=Aa123456&createType=create'
    }
  })

  const wrapper = shallowMount(settingAbout, {
    store,
    localVue,
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

  it('setting-about.vue-test', async () => {
    wrapper.vm.back()
    const href1 = window.location.href
    expect(href1.indexOf('setting')).not.toBe(-1)

    wrapper.vm.closeSetting()
    const href2 = window.location.href
    expect(href2.indexOf('wallet')).not.toBe(-1)

    // wrapper.vm.toService()
    // const href3 = window.location.href
    // expect(href3.indexOf('service')).not.toBe(-1)
    //
    // wrapper.vm.toPrivacy()
    // const href4 = window.location.href
    // expect(href4.indexOf('private')).not.toBe(-1)
  })
})
