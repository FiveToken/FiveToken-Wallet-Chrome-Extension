/* eslint-disable no-undef */
import {
  formatNumber,
  isProxy,
  isFilecoinChain,
  getF1ByMne,
  getF1ByPrivateKey,
  strToHexCharCode,
  formatDate,
  add0,
  parseE,
  isValidAddress,
  trimStr,
  fil2atto,
  isDecimal
  // zxcvbnFun
} from '@/utils/index.js'
import { mocksData } from '../mock'
jest.mock('@/utils/local-store', () => (class ExtensionStore {
  get (key) {
    return mocksData[key]
  }

  set () {
    jest.fn()
  }
}))
describe('', () => {
  test('fn formatNumber()', () => {
    expect(formatNumber('0.6102766958759903', 4)).toBe('0.6103')
    expect(formatNumber('1', 4)).toBe('1')
  })

  test('fn isProxy()', () => {
    expect(isProxy('proxy')).toBe(true)
  })

  test('fn isFilecoinChain()', () => {
    expect(isFilecoinChain('proxy')).toBe(true)
    expect(isFilecoinChain('filecoin')).toBe(true)
  })

  test('fn getF1ByMne()', async () => {
    const words = 'repair grab relief impact coil staff adjust era found obtain allow logic'
    const networkType = 'proxy'
    const networkType2 = 'ethereum'
    const password = 'Aa1234567890'
    const first = 'f'
    const index = 0
    window.crypto = jest.fn()
    window.crypto.subtle = jest.fn()
    window.crypto.subtle.generateKey = jest.fn()
    window.crypto.subtle.exportKey = jest.fn()
    window.crypto.subtle.encrypt = jest.fn()
    window.crypto.subtle.importKey = jest.fn()
    const _filecoin = await getF1ByMne(words, password, networkType, first, index)
    const _ethereum = await getF1ByMne(words, password, networkType2, first, index)
    expect(_filecoin.address).toEqual('f1ntv4qlgoi55wqqxrxxolatfdgn7xvu7vfhrkcfq')
    expect(_ethereum.address).toEqual('0x5500192B3cEdDfF421747DDE66427369098f0D6C')
  })

  test('fn getF1ByPrivateKey()', async () => {
    const filecoinPrivateKey = 'rl1X9xq76Z7nXoScb0Ubha+35pXKEnIJYaF3x9RTGlg='
    const ethereumPrivateKey = '0x3189a48bc9c73c13c65f0eaf59f964b70f5cad3c8ad5c0d915e757d37c4eb696'
    const password = 'Aa1234567890'
    const _filecoin = await getF1ByPrivateKey(filecoinPrivateKey, password, 'filecoin', 'f')
    const _ethereum = await getF1ByPrivateKey(ethereumPrivateKey, password, 'ethereum', '')
    expect(_filecoin.address).toEqual('f1iapsen3qprfd6zs2r5ud72n4gnotatcxp6xcn4y')
    expect(_ethereum.address).toEqual('0x5500192B3cEdDfF421747DDE66427369098f0D6C')
  })

  test('fn strToHexCharCode()', () => {
    const pk = 'rl1X9xq76Z7nXoScb0Ubha+35pXKEnIJYaF3x9RTGlg='
    expect(strToHexCharCode('')).toBe('')
    expect(strToHexCharCode(pk)).toBe('7b2254797065223a22736563703235366b31222c22507269766174654b6579223a22726c315839787137365a376e586f53636230556268612b333570584b456e494a5961463378395254476c673d227d')
  })

  test('fn formatDate()', () => {
    expect(formatDate(1631527337)).toBe('2021-09-13')
    // expect(formatDate(1631527337, true)).toBe('2021-09-13 10:02:17')
  })

  test('fn add0()', () => {
    expect(add0(9)).toBe('09')
    expect(add0(11)).toBe(11)
  })

  test('fn parseE()', () => {
    expect(parseE(1000000000000000)).toBe(1000000000000000)
    expect(parseE('3.5e-10')).toBe('0.00000000035')
    expect(parseE('3.5e+10')).toBe('35000000000')
  })

  test('fn isValidAddress()', async () => {
    const _ethereum = await isValidAddress('0x3FB4F280cF531Ba7d88Fe4D0748A451E4D4276AD', 'ethereum')
    expect(_ethereum).toBe(true)
  })

  test('fn trimStr()', () => {
    expect(trimStr('  FiveToken   ')).toBe('FiveToken')
  })

  test('fn fil2atto()', () => {
    expect(fil2atto('dd')).toBe('')
    expect(fil2atto(0.001)).toBe('1000000000000000')
  })

  test('fn isDecimal()', () => {
    expect(isDecimal('string')).toBe(false)
  })

  test('fn zxcvbn', () => {
    // const res = zxcvbnFun('Tr0ub4dour&3')
    // const res1 = zxcvbnFun('123456')
    // const res2 = zxcvbnFun('speaking1893')
    // const res3 = zxcvbnFun('Speaking1893&@$$!ijowsijojiwaiawj09wj0ea90e9wj09ew09hadouuhdashiuahiua')
    // console.log(res)
    // console.log(res1)
    // console.log(res2)
    // console.log(res3)
  })
})
