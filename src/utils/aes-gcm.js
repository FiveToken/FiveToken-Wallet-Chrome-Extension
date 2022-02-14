import { TextEncoder, TextDecoder } from 'stringencoding'
import { stringToUint8Array, ArrayBufferToString, StringToArrayBuffer } from './typeof'
import ExtensionStore from '@/utils/local-store'
export function getMessageEncoding (value) {
  const enc = new TextEncoder()
  return enc.encode(value)
}

export function getMessageDeCoding (value) {
  const dec = new TextDecoder()
  return dec.decode(value)
}

export async function encryptMessage (message, senderPublicKey, address) {
  let key
  const localStore = new ExtensionStore()
  const encoded = getMessageEncoding(message)
  const publicKey = stringToUint8Array(senderPublicKey + address)
  const storeKey = await localStore.get(address)
  if (storeKey !== null) {
    key = await window.crypto.subtle.importKey(
      'jwk',
      storeKey,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    )
  } else {
    key = await generateKey()
    const exportKey = await window.crypto.subtle.exportKey(
      'jwk',
      key
    )
    const obj = {}
    obj[address] = exportKey
    await localStore.set(obj)
  }
  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: publicKey
    },
    key,
    encoded
  )
  return ArrayBufferToString(ciphertext)
}

export async function decryptMessage (ciphertextString, senderPublicKey, address) {
  const localStore = new ExtensionStore()
  const ciphertext = StringToArrayBuffer(ciphertextString)
  const publicKey = stringToUint8Array(senderPublicKey + address)
  const importKey = await localStore.get(address)
  try {
    const key = await window.crypto.subtle.importKey(
      'jwk',
      importKey,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    )
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: publicKey
      },
      key,
      ciphertext
    )
    return ArrayBufferToString(decrypted)
  } catch (e) {
    return null
  }
}

export async function generateKey () {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  )
}

export async function encrypt (message, salt) {
  let key
  const localStore = new ExtensionStore()
  const encoded = getMessageEncoding(message)
  const publicKey = stringToUint8Array(salt)
  const storeKey = await localStore.get(salt)
  if (storeKey != null) {
    key = await window.crypto.subtle.importKey(
      'jwk', storeKey,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    )
  } else {
    key = await generateKey()
    const exportKey = await window.crypto.subtle.exportKey(
      'jwk',
      key
    )
    const obj = {}
    obj[salt] = exportKey
    await localStore.set(obj)
  }
  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: publicKey
    },
    key,
    encoded
  )
  return ArrayBufferToString(ciphertext)
}

export async function decrypt (ciphertextString, salt) {
  const localStore = new ExtensionStore()
  const ciphertext = StringToArrayBuffer(ciphertextString)
  const publicKey = stringToUint8Array(salt)
  const importKey = await localStore.get(salt)
  try {
    const key = await window.crypto.subtle.importKey(
      'jwk',
      importKey,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    )
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: publicKey
      },
      key,
      ciphertext
    )
    return ArrayBufferToString(decrypted)
  } catch (e) {
    return null
  }
}
