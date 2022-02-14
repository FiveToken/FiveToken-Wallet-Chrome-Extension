/* eslint-disable no-undef */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import importPrivatekey from '@/pages/import-privatekey/component/index.vue'
import selectNetwork from '@/pages/import-privatekey/component/select-network.vue'
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
      href: './import-privateKey.html'
    }
  })

  const wrapper = shallowMount(importPrivatekey, {
    store,
    localVue,
    data () {
      return {
        loading: require('@/assets/image/loading.png'),
        privatekey: '',
        isFetch: false,
        center: true,
        net: '',
        networkVisible: false,
        passwordVisable: false,
        mnePsd: null,
        customNetwork: ''
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
    expect(wrapper.vm.net).toBe('https://api.fivetoken.io')
    const obj = {
      networkType: 'ethereum',
      filecoinAddress0: '',
      rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545'
    }
    const obj1 = {
      accountName: 'Account2',
      browser: 'https://filscan.io',
      chainID: '1',
      createTime: 1644715573,
      decimals: 18,
      deriveIndex: 1,
      disabled: true,
      filecoinAddress0: 'f',
      ids: 'filecoin',
      image: 'fil.svg',
      name: 'Filcoin Mainnet',
      networkType: 'proxy',
      rpc: 'https://api.fivetoken.io',
      symbol: 'FIL'
    }
    await wrapper.vm.confirmNet(obj1)
    expect(wrapper.vm.net).toBe('https://api.fivetoken.io')

    const privatekey1 = '7b2254797065223a22736563703235366b31222c22507269766174654b6579223a22444f776a377669762b756c79524e684a4c4d30346c733270626236704256335876516e2f4a5353573253633d227d'
    await wrapper.vm.privatekeyChange(privatekey1)
    expect(wrapper.vm.privatekey).toBe(privatekey1)

    wrapper.vm.selectNet()
    expect(wrapper.vm.networkVisible).toBe(true)

    wrapper.vm.closeNet()
    expect(wrapper.vm.networkVisible).toBe(false)

    await wrapper.vm.importWallet()
    const password = '@Aa123456789012zpc'
    await wrapper.vm.confirmPassword(password)
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
