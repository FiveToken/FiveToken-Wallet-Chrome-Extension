/* eslint-disable no-undef */
import { encryptMessage, decryptMessage, encrypt, decrypt } from '@/utils/aes-gcm'
import extension from 'extensionizer'
import { mocksData } from '../mock'
const password = '1234567890121212'
const mne = 'vintage about dice wagon border labor toy property correct credit digital drum'
const salt = '724b092810ec86d7e35c9d067702b31ef90bc43a7b598626749914d6a3e033ed'
const address = 'f14xxtyp7negvl3rvacc67povupv3tsu4b2ngjepq'

jest.mock('@/utils/local-store', () => (class ExtensionStore {
  get (key) {
    return mocksData[key]
  }

  set () {
    jest.fn()
  }
}))
describe('', () => {
  test('fn encryptMessage ', async () => {
    extension.storage = jest.fn()
    extension.storage.local = jest.fn()
    extension.storage.local.get = jest.fn()
    window.crypto = jest.fn()
    window.crypto.subtle = jest.fn()
    window.crypto.subtle.generateKey = jest.fn()
    window.crypto.subtle.exportKey = jest.fn()
    window.crypto.subtle.encrypt = jest.fn()
    window.crypto.subtle.importKey = jest.fn()
    const publicKey = await encrypt(password, address)
    const encrypted = await encryptMessage(password, publicKey, address)
    await decryptMessage(encrypted, publicKey, address)
  })

  test('fn encryptMessage()', async () => {
    const encrypted = await encrypt(mne, salt)
    await decrypt(encrypted, salt)
  })
})
