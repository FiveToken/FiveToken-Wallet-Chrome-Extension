/* eslint-disable no-undef */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import createWallet from '@/pages/create-wallet/component/index.vue'
import elementUI from 'element-ui'
import { Database } from '@/utils/database.js'
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
              create_time: 1631613193,
              digest: 'zBUjeDDJuuDAPNQF',
              fil: 0,
              id: 1,
              isDelete: 0,
              khazix: 'khazix',
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

  const wrapper = shallowMount(createWallet, {
    store,
    localVue,
    data () {
      return {
        db,
        form: {
          accountName: '',
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
    }
  })

  it('index.vue-test', async () => {
    wrapper.vm.layoutMounted()
    wrapper.vm.nameChange('Acount2')
    const accountName = wrapper.vm.form.accountName
    expect(accountName).toBe('Acount2')

    wrapper.vm.passwordChange('Aa123456')
    const password = wrapper.vm.form.password
    expect(password).toBe('Aa123456')

    wrapper.vm.confirmChange('Aa123456')
    const confirmPassword = wrapper.vm.form.confirmPassword
    expect(confirmPassword).toBe('Aa123456')

    wrapper.vm.passwordEye('text')
    const passwordType = wrapper.vm.passwordType
    expect(passwordType).toBe('text')

    wrapper.vm.confirmEye('text')
    const confirmType = wrapper.vm.confirmType
    expect(confirmType).toBe('text')

    wrapper.setData({ createType: 'create' })
    wrapper.vm.create()
    const href1 = window.location.href
    expect(href1.indexOf('create-words.html')).not.toBe(-1)

    wrapper.setData({ createType: 'importWords' })
    wrapper.vm.create()
    const href2 = window.location.href
    expect(href2.indexOf('import-words.html')).not.toBe(-1)
  })
})
