/* eslint-disable no-undef */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import sendFil from '@/pages/send-fil/component/index.vue'
import elementUI from 'element-ui'
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
        decimals: 18,
        activeNetwork: {
          name: 'Filcoin Mainnet',
          rpc: 'https://api.fivetoken.io',
          chainID: '',
          symbol: 'FIL',
          ids: 'filecoin',
          browser: 'https://filscan.io',
          networkType: 'proxy',
          filecoinAddress0: 'f',
          decimals: 18,
          disabled: true,
          image: 'fil.svg',
          deriveIndex: 0
        },
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
        networks: networks,
        onLine: false
      },
      mutations: {
        SET_PRIVATEKEY: jest.fn(),
        SET_ADDRESS: jest.fn(),
        SET_DIGEST: jest.fn(),
        SET_ACCOUNTNAME: jest.fn(),
        SET_DERIVEINDEX: jest.fn()
      },
      namespaced: true
    },
    'send-fil': {
      state: {
        addressBook: [],
        addressRecordLast: [],
        accountList: [],
        address: '',
        tokenList: [],
        serviceGas: {
          gasLimit: 0,
          gasPremium: 0,
          gasFeeCap: 0,
          gasPrice: 0,
          maxPriorityFeePerGas: 0,
          maxFeePerGas: 0,
          rpcType: 'filecoin'
        }
      },
      getters: {
        gettersAccountList: jest.fn(),
        handlingFee: jest.fn()
      },
      mutations: {
        SET_ADDRESS: jest.fn(),
        SET_SERVICEGAS: jest.fn(),
        SET_ACCOUNTLIST: jest.fn(),
        SET_ADDRESSBOOK: jest.fn(),
        SET_ADDRESSRECORDLAST: jest.fn(),
        SET_TOKENLIST: jest.fn()
      },
      namespaced: true
    }
  }
})

jest.mock('@/utils/local-store', () => (class ExtensionStore {
  get (key) {
    return mocksData[key]
  }

  set () {
    jest.fn()
  }
}))

describe('send-fil.vue', () => {
  const assignMock = jest.fn()
  delete window.location
  window.location = { assign: assignMock }
  afterEach(() => {
    assignMock.mockClear()
  })

  Object.defineProperty(window, 'location', {
    value: {
      href: './setting-about.html',
      search: '?backups=privateKey'
    }
  })

  // const stepOneComponent = shallowMount(stepOne, {
  //   store,
  //   propsData: {
  //     formData: {
  //       balance: 0,
  //       to: '',
  //       toName: '',
  //       fil: '',
  //       symbol: '',
  //       chainName: '',
  //       decimals: 0,
  //       isAll: 0,
  //       isMain: -1,
  //       contract: ''
  //     }
  //   },
  //   computed: {
  //     active () {
  //       return true
  //     },
  //     owenChain () {
  //       return true
  //     },
  //     chainImg () {
  //       return ''
  //     },
  //     chainName () {
  //       return ''
  //     }
  //   },
  //   stubs: {
  //     'el-dialog': true,
  //     'el-input': true,
  //     'el-button': true
  //   },
  //   mocks: {
  //     $t: key => key
  //   }
  // })
  // console.log(stepOneComponent, 'stepOneComponent')
  const wrapper = shallowMount(sendFil, {
    store,
    localVue,
    data () {
      return {
        loading: require('@/assets/image/loading.png'),
        passwordVisable: false,
        isFetch: false,
        step: 1,
        priceCurrency: 0,
        nonce: 0,
        maxNonce: 0,
        contractSigner: null,
        localStore: null,
        mainBalance: 0,
        formData: {
          balance: 0,
          to: '',
          toName: '',
          fil: '',
          symbol: '',
          chainName: '',
          decimals: 0,
          isAll: 0,
          isMain: -1,
          contract: ''
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

  it('send-fil.vue-test', async () => {
    wrapper.vm.layoutMounted()
    wrapper.vm.getTokenList()
    const obj1 = {
      key: 'isAll',
      value: 1
    }
    const obj2 = {
      key: 'token',
      value: {
        balance: 0, symbol: '', chainName: '', decimals: 18, isMain: 1, contract: ''
      }
    }
    const obj3 = {
      key: 'fil',
      value: '0'
    }
    wrapper.vm.formDataChange(obj1)
    wrapper.vm.formDataChange(obj2)
    wrapper.vm.formDataChange(obj3)
    wrapper.vm.getNextNonce()
    wrapper.vm.getBaseFeeAndGas()
    wrapper.vm.getFilPricePoints()
    wrapper.vm.next()
    const data = {
      cid: 'xxx',
      nonce: '3',
      value: '1'
    }
    wrapper.vm.storeMessage(data)
  })
})
