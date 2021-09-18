/* eslint-disable no-undef */
import {
  formatNumber,
  isProxy,
  isFilecoinChain,
  getF1ByMne,
  getF1ByPrivateKey,
  getDecodePrivateKey,
  validatePassword,
  strToHexCharCode,
  formatDate,
  add0,
  parseE,
  isValidAddress,
  trimStr,
  fil2atto,
  isDecimal,
  setGlabolKek,
  getGlobalKek
} from '@/utils/index.js'

test('fn formatNumber()', () => {
  expect(formatNumber('0.6102766958759903', 4)).toBe('0.6102')
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
  const kek = 'PWYbGFjvrmaeedDQaCrPX26MZ5VWAfTbBr/WHeFEs1k='
  const networkType = 'proxy'
  const networkType2 = 'ethereum'
  const first = 'f'
  const index = 0
  expect(await getF1ByMne(words, kek, networkType, first, index)).toEqual({
    address: 'f1ntv4qlgoi55wqqxrxxolatfdgn7xvu7vfhrkcfq',
    privateKey: '98b983395737275c208f5b6884180cbc7575e7c208dba4621da300fc5248046ec7224a209285b4e9e770fa1e',
    digest: 'zBUjeDDJuuDAPNQF'
  })
  expect(await getF1ByMne(words, kek, networkType2, first, index)).toEqual({
    address: '0x5500192B3cEdDfF421747DDE66427369098f0D6C',
    privateKey: 'eea4df6b0e6b152149df4a28a45f6cb47569b5900acded5324a903f547165663ca651974e895b0e69b74b542e490de6300f0d50985482702b0c7ba38c80ddc1dec69',
    digest: 'wK1aVCTjO72VbAS2'
  })
})

test('fn getF1ByPrivateKey()', async () => {
  const privateKey = 'rl1X9xq76Z7nXoScb0Ubha+35pXKEnIJYaF3x9RTGlg='
  const kek = 'PWYbGFjvrmaeedDQaCrPX26MZ5VWAfTbBr/WHeFEs1k='
  const networkType = 'proxy'
  const first = 'f'
  expect(await getF1ByPrivateKey(privateKey, kek, networkType, first)).toEqual({
    address: 'f1iapsen3qprfd6zs2r5ud72n4gnotatcxp6xcn4y',
    privateKey: 'acb0dd020f2a052247e71e7f9f070cb4266a83c457caf60570bf6e876441291df1336f21a5cf83d6ef7bea1e',
    digest: '4HwSw+ek6vyjoQqy'
  })
  const eKey = '0x3189a48bc9c73c13c65f0eaf59f964b70f5cad3c8ad5c0d915e757d37c4eb696'
  expect(await getF1ByPrivateKey(eKey, kek, 'ethereum', '')).toEqual({
    address: '0x5500192B3cEdDfF421747DDE66427369098f0D6C',
    privateKey: 'eea4df6b0e6b152149df4a28a45f6cb47569b5900acded5324a903f547165663ca651974e895b0e69b74b542e490de6300f0d50985482702b0c7ba38c80ddc1dec69',
    digest: 'wK1aVCTjO72VbAS2'
  })

  expect(await getF1ByPrivateKey('', '')).toEqual(null)
})

test('fn getDecodePrivateKey()', async () => {
  const privateKey = 'acb0dd020f2a052247e71e7f9f070cb4266a83c457caf60570bf6e876441291df1336f21a5cf83d6ef7bea1e'
  const kek = 'PWYbGFjvrmaeedDQaCrPX26MZ5VWAfTbBr/WHeFEs1k='
  const networkType = 'proxy'
  const bol = true
  const eKey = 'eea4df6b0e6b152149df4a28a45f6cb47569b5900acded5324a903f547165663ca651974e895b0e69b74b542e490de6300f0d50985482702b0c7ba38c80ddc1dec69'

  expect(await getDecodePrivateKey(privateKey, kek, networkType, bol)).toBe('7b2254797065223a22736563703235366b31222c22507269766174654b6579223a22726c315839787137365a376e586f53636230556268612b333570584b456e494a5961463378395254476c673d227d')
  expect(await getDecodePrivateKey(privateKey, kek, networkType, false)).toBe('rl1X9xq76Z7nXoScb0Ubha+35pXKEnIJYaF3x9RTGlg=')
  expect(await getDecodePrivateKey(eKey, kek, 'ethereum', bol)).toBe('0x3189a48bc9c73c13c65f0eaf59f964b70f5cad3c8ad5c0d915e757d37c4eb696')
})

test('fn validatePassword()', async () => {
  const passsord = 'Aa123456'
  const salt = 'Ur79Zed0RBWDAU4wz0/00uqdRKFCa0HujGKsqAthGcY='
  expect(await validatePassword(passsord, salt)).toBe(true)
  expect(await validatePassword('Aa12345', salt)).toBe(false)
  expect(await validatePassword()).toBe(false)
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

test('fn isValidAddress()', () => {
  expect(isValidAddress('0x3FB4F280cF531Ba7d88Fe4D0748A451E4D4276AD', 'ethereum')).toBe(true)
  expect(isValidAddress('t0123261', 'proxy')).toBe(true)
  expect(isValidAddress('f0123261', 'proxy')).toBe(true)
  expect(isValidAddress('f1iapsen3qprfd6zs2r5ud72n4gnotatcxp6xcn4y', 'proxy')).toBe(true)
  expect(isValidAddress('f2iapsen3qprfd6zs2r5ud72n4gnotatcxp6xcn4y', 'proxy')).toBe(true)
  expect(isValidAddress('   ', 'proxy')).toBe(true)
  expect(isValidAddress('f3rnhucodf3dfmuowe4gielkwctiyrnkubinmmgu7muttipqhdutgkjlzhcoc243wtp72ohclddmyvzvrbjeua', 'proxy')).toBe(true)
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

test('fn setGlabolKek()', () => {
  setGlabolKek('PWYbGFjvrmaeedDQaCrPX26MZ5VWAfTbBr/WHeFEs1k=')
  const kek = window.localStorage.getItem('ftKek')
  expect(kek).toBe('PWYbGFjvrmaeedDQaCrPX26MZ5VWAfTbBr/WHeFEs1k=')
})

test('fn getGlobalKek()', () => {
  window.localStorage.setItem('ftKek', 'PWYbGFjvrmaeedDQaCrPX26MZ5VWAfTbBr/WHeFEs1k=')
  expect(getGlobalKek()).toBe('PWYbGFjvrmaeedDQaCrPX26MZ5VWAfTbBr/WHeFEs1k=')
})
