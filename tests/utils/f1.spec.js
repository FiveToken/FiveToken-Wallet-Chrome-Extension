/* eslint-disable no-undef */
import {
  genT1WalletByMne,
  genT1WalletByCK,
  genPrivateKeyFromMne,
  genPrivateKeyDigest
} from '@/utils/f1.js'

test('fn genT1WalletByMne()', async () => {
  const words = 'labor water attract mad cat endorse album jeans scissors response guess answer'
  const filecoinAddress0 = 'f'
  const path = "m/44'/461'/0'/0"
  const index = 0
  const ck = await genPrivateKeyFromMne(words, path, index)
  expect(await genT1WalletByMne(ck, filecoinAddress0)).toEqual({
    address: 'f1iapsen3qprfd6zs2r5ud72n4gnotatcxp6xcn4y',
    privateKey: 'rl1X9xq76Z7nXoScb0Ubha+35pXKEnIJYaF3x9RTGlg='
  })
})

test('fn genT1WalletByCK()', async () => {
  const ck = 'rl1X9xq76Z7nXoScb0Ubha+35pXKEnIJYaF3x9RTGlg='
  const filecoinAddress0 = 'f'
  expect(await genT1WalletByCK(ck, filecoinAddress0)).toEqual({
    address: 'f1iapsen3qprfd6zs2r5ud72n4gnotatcxp6xcn4y',
    privateKey: 'rl1X9xq76Z7nXoScb0Ubha+35pXKEnIJYaF3x9RTGlg='
  })
})

test('fn genPrivateKeyFromMne()', async () => {
  const words = 'slogan develop student flavor chair raccoon sand raven confirm bike dash expand'
  const path = "m/44'/461'/0'/0"
  const index = 0
  const _arrayBuffer = await genPrivateKeyFromMne(words, path, index)
  expect(_arrayBuffer.toString('hex')).toEqual('b7a10bea0645a53a6eeac0fe9e5ac1f622ae6ea776d543b796f4903cd3347904')
})

test('fn genPrivateKeyDigest()', async () => {
  const privateKey = 'rl1X9xq76Z7nXoScb0Ubha+35pXKEnIJYaF3x9RTGlg='
  const digestRes = 'gUCGRAD8GwdLpoe5'
  const digest = await genPrivateKeyDigest(privateKey)
  expect(digest).toEqual(digestRes)
})
