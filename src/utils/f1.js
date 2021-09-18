/* eslint-disable camelcase */

import * as CryptoJS from 'crypto-js'
// import sha256 from 'crypto-js/sha256';
import blake from 'blakejs'
import * as bip39 from 'bip39'
import base32Encode from 'base32-encode'
import { Buffer } from 'buffer'
import hdkey from 'ethereumjs-wallet/hdkey'
import * as ethutil from 'ethereumjs-util'
// import {
//   tail
// } from 'mytoolkit'

export function genT1WalletByMne (mne, filecoinAddress0, path, index) {
  const ck = genPrivateKeyFromMne(mne, path, index)
  const privateStr = ck.toString('base64')
  const pubkey = privateToPublicKey(ck)
  let address = getAddressByPublicKey(pubkey)
  const encode_prefix = filecoinAddress0
  address = `${encode_prefix}1${address}`
  return {
    address: address,
    privateKey: privateStr
  }
}

export function genT1WalletByCK (ck, filecoinAddress0) {
  const privateStr = ck
  const pk = Buffer.from(ck, 'base64')
  const pubkey = ethutil.privateToPublic(pk)
  let address = getAddressByPublicKey(pubkey)
  const encode_prefix = filecoinAddress0
  address = `${encode_prefix}1${address}`
  return {
    address: address,
    privateKey: privateStr
  }
}

export function genPrivateKeyFromMne (mne, path, index) {
  // m/44'/461'/0'/0
  // m/44'/60'/0'/0
  const fileCoinDerivePath = path
  const seed = bip39.mnemonicToSeedSync(mne)
  const rootKey = hdkey.fromMasterSeed(seed)
  const deriveKey = rootKey.derivePath(fileCoinDerivePath)
  const k0 = deriveKey.deriveChild(index)
  return Buffer.from(k0._hdkey._privateKey)
}

export function privateToPublicKey (ck) {
  return ethutil.privateToPublic(ck)
}
export function getAddressByPublicKey (pubkey) {
  const pk = Array.from(pubkey)
  pk.unshift(4)
  const address = blake2b(Uint8Array.from(pk), 20)
  const add = Array.from(address)
  add.unshift(1)
  const cksm = blake2b(Uint8Array.from(add), 4)
  const addressArr = Array.from(address)
  const cksmArr = Array.from(cksm)
  // console.log(array2hex(addressArr), array2hex(cksmArr))
  const addrBuff = Uint8Array.from(addressArr.concat(cksmArr))
  return base32Encode(addrBuff, 'RFC4648', {
    padding: false
  }).toLowerCase()
}

export function blake2b (arr, len) {
  return blake.blake2b(arr, null, len)
}

export async function genPrivateKeyDigest (privateKey) {
  const digest = CryptoJS.SHA256(privateKey).toString(CryptoJS.enc.Base64)
  return digest.substring(0, 16)
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
