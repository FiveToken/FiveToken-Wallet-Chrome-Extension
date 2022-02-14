/* eslint-disable no-undef */
import { encryptSodium, decryptSodium, initSodium, encrypt, decrypt } from '@/utils/libsodium.js'
import { hashSodium } from '../../src/utils/libsodium'
const address = '0xa45bc341e17e7bb8c3183644f6293e0a6d16071e'
const pass = '1234567890123456'
test('libsodium encryptSodium decryptSodium', async () => {
  const sodium = await initSodium()
  const passHash = sodium.to_hex(pass)
  const res = await encryptSodium(pass, address, passHash)
  const res1 = await decryptSodium(res, address, passHash)
  const hash1 = await hashSodium('helloWorld')
  const hashres = '35b77760b98ccc93cb97d3652ffc522fe250edba8858be0b90a8086834f904e829acc316524ec97ae606317a09235a19449895088c51baa963b271b0d45b3238'
  expect(hash1).toBe(hashres)
  expect(res1).toBe(pass)
})

test('libsodium encrypt decrypt', async () => {
  const key = '724b092810ec86d7e35c9d067702b31ef90bc43a7b598626749914d6a3e033ed'
  const res = await encrypt(pass, key)
  const res1 = await decrypt(res, key)
  expect(pass).toBe(res1)
})
