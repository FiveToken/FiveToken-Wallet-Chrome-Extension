import { TextEncoder } from 'stringencoding'
import { reverse } from '@/utils/index'
const libsodium = require('libsodium-wrappers')
// let key = libsodium.from_hex("724b092810ec86d7e35c9d067702b31ef90bc43a7b598626749914d6a3e033ed")

export async function initSodium () {
  await libsodium.ready
  return libsodium
}

// function splitNonceFromMessage
// params  messageWithNonce

export async function splitNonceFromMessage (messageWithNonce) {
  const sodium = await initSodium()
  const bytes = sodium.crypto_box_NONCEBYTES
  const nonce = messageWithNonce.slice(0, bytes)
  const message = messageWithNonce.slice(bytes, messageWithNonce.length)
  return [nonce, message]
}

// function gennerateNonce

export async function gennerateNonce () {
  const sodiumInstance = await initSodium()
  const length = await sodiumInstance.crypto_box_NONCEBYTES
  const res = await randomBytes(length)
  return res
}

// function randomBytes
// params  length

export async function randomBytes (length) {
  const sodiumInstance = await initSodium()
  return sodiumInstance.randombytes_buf(length)
}

// function encryptSodium
// params
// message, senderPublicKey, recipientKey

export async function encryptSodium (message, senderPublicKey, recipientKey) {
  message = TextEncoder('utf-8').encode(message)
  senderPublicKey = TextEncoder('utf-8').encode(senderPublicKey).slice(0, 32)
  recipientKey = TextEncoder('utf-8').encode(recipientKey).slice(0, 32)
  const sodiumInstance = await initSodium()
  const nonce = await gennerateNonce()
  const ciphertext = sodiumInstance.crypto_box_easy(
    message, // value
    nonce, // nonce
    recipientKey, // address
    senderPublicKey // secretKey
  )
  const nonceArray = Array.from(nonce)
  const ciphertextArray = Array.from(ciphertext)
  const array = nonceArray.concat(ciphertextArray)
  const unitArray = new Uint8Array(array)
  return Uint8ArrayToString(unitArray)
}

// function decryptSodium
// params
// ciphertextWithNonce, senderPublicKey, recipientKey

export async function decryptSodium (ciphertextWithNonce, senderPublicKey, recipientKey) {
  const sodiumInstance = await initSodium()
  senderPublicKey = TextEncoder('utf-8').encode(senderPublicKey).slice(0, 32)
  recipientKey = TextEncoder('utf-8').encode(recipientKey).slice(0, 32)
  ciphertextWithNonce = stringToUint8Array(ciphertextWithNonce)
  const res = await splitNonceFromMessage(ciphertextWithNonce)
  const [nonce, ciphertext] = res
  const decrypted = sodiumInstance.crypto_box_open_easy(
    ciphertext, // value
    nonce, // nonce
    recipientKey, // address
    senderPublicKey // secretKey
  )
  return Uint8ArrayToString(decrypted)
}

// function encrypt_and_prepend_nonce
// parmas message, key

export async function encryptAndPrependNonce (message, key) {
  const sodiumInstance = await initSodium()
  const nonceTypes = sodiumInstance.crypto_secretbox_NONCEBYTES
  const messageHash = await hashSodium(message)
  const nonceKey = reverse(messageHash)
  let nonce
  const nonceValue = localStorage.getItem(nonceKey)
  if (nonceValue !== null) {
    nonce = stringToUint8Array(nonceValue)
  } else {
    nonce = sodiumInstance.randombytes_buf(nonceTypes)
    localStorage.setItem(nonceKey, Uint8ArrayToString(nonce))
  }
  const encrypted = sodiumInstance.crypto_secretbox_easy(message, nonce, key)
  const nonceArray = Array.from(nonce)
  const encryptedArray = Array.from(encrypted)
  const combined2 = nonceArray.concat(encryptedArray)
  const unitCombined2 = new Uint8Array(combined2)
  return unitCombined2
}

// decrypt_after_extracting_nonce
// params nonce_and_ciphertext key

export async function decryptAfterExtractingNonce (nonceWithCiphertext, key) {
  const sodiumInstance = await initSodium()
  const nonceBytes = sodiumInstance.crypto_secretbox_NONCEBYTES
  const macBytes = sodiumInstance.crypto_secretbox_MACBYTES
  if (nonceWithCiphertext < nonceBytes + macBytes) {
    // eslint-disable-next-line no-throw-literal
    throw 'Short message'
  }
  const nonce = nonceWithCiphertext.slice(0, nonceBytes)
  const ciphertext = nonceWithCiphertext.slice(nonceBytes)
  return sodiumInstance.crypto_secretbox_open_easy(ciphertext, nonce, key)
}

function Uint8ArrayToString (fileData) {
  let dataString = ''
  for (let i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i])
  }

  return dataString
}

function stringToUint8Array (str) {
  const arr = []
  for (let i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i))
  }

  const tmpUint8Array = new Uint8Array(arr)
  return tmpUint8Array
}

// function encrypt
// params message, key
export async function encrypt (message, key) {
  const sodiumInstance = await initSodium()
  const messageUnit8Array = TextEncoder('utf-8').encode(message)
  const keyUnit8Array = sodiumInstance.from_hex(key)
  const res = await encryptAndPrependNonce(messageUnit8Array, keyUnit8Array)
  return Uint8ArrayToString(res)
}

// function decrypt
// params nonce_and_ciphertext_str, key
export async function decrypt (nonceWithCiphertextStr, key) {
  const sodiumInstance = await initSodium()
  const nonceWithCiphertext = stringToUint8Array(nonceWithCiphertextStr)
  const keyUnit8Array = sodiumInstance.from_hex(key)
  const res = await decryptAfterExtractingNonce(nonceWithCiphertext, keyUnit8Array)
  return Uint8ArrayToString(res)
}

// function hashSodium
// params  str
export async function hashSodium (str) {
  const sodiumInstance = await initSodium()
  const h = sodiumInstance.crypto_generichash(64, sodiumInstance.from_string(str))
  return sodiumInstance.to_hex(h)
}
