/* eslint-disable new-cap */
import * as CryptoJS from 'crypto-js'
import aesjs from 'aes-js'
const CTRCouterNumber = 6

export function privateKeyEncode (sk, kek) {
  const pk = AESEncrypt(sk, kek)
  return pk
}

export function privateKeyDecode (encodePrivateKey, kek) {
  const pk = AESDecrypt(encodePrivateKey, kek)
  return pk
}

export function genSalt (password) {
  const str = `fiveToken${password}`
  const hash = CryptoJS.SHA256(str)
  return hash.toString(CryptoJS.enc.Base64)
}

export function genKek (password) {
  const salt = genSalt(password)
  const kek = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32
  })
  const kekString = CryptoJS.enc.Base64.stringify(kek)
  return kekString
}

export function AESEncrypt (word, key) {
  const keyMD5 = CryptoJS.MD5(key).toString()
  const keyBytes = aesjs.utils.hex.toBytes(keyMD5)
  const wordBytes = aesjs.utils.utf8.toBytes(word)
  const aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter(CTRCouterNumber))
  const encryptedData = aesCtr.encrypt(wordBytes)
  const encryptedStr = aesjs.utils.hex.fromBytes(encryptedData)
  return encryptedStr
}

export function AESDecrypt (encryptedData, key) {
  const keyMD5 = CryptoJS.MD5(key).toString()
  const keyBytes = aesjs.utils.hex.toBytes(keyMD5)
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedData)
  const aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter(CTRCouterNumber))
  const decryptedBytes = aesCtr.decrypt(encryptedBytes)
  const decryptedStr = aesjs.utils.utf8.fromBytes(decryptedBytes)
  return decryptedStr
}

// export function skToArray (sk) {
//   const skarr = CryptoJS.enc.Base64.parse(sk)
//   return skarr.words
// }

// export function xor (first, second) {
//   const list = []
//   for (let i = 0; i < first.length; i++) {
//     const ele = first[i]
//     const ele2 = second[i]
//     const res = ele ^ ele2
//     list.push(res)
//   }
//   return list
// }
