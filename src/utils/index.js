/* eslint-disable camelcase */
import { trim } from 'mytoolkit'
import {
  genT1WalletByMne,
  genT1WalletByCK,
  genPrivateKeyFromMne,
  genPrivateKeyDigest
} from '@/utils/f1'
import {
  privateKeyEncode,
  privateKeyDecode,
  genSalt
} from '@/utils/key'

import { BigNumber } from 'bignumber.js'
import { Wallet } from 'ethers'

export const fiveTokenVersion = '1.2.2'

export const minimumPrecision = 0.00000001

export function formatNumber (str, n) {
  const index = str.indexOf('.')
  if (index > -1) {
    const arr = str.split('.')
    const num = arr[0] + '.' + arr[1].substring(0, n)
    return num
  } else {
    return str
  }
}

export function isProxy (networkType) {
  return networkType === 'proxy'
}

export function isFilecoinChain (networkType) {
  return (networkType === 'proxy' || networkType === 'filecoin')
}

export function getGlobalKek () {
  const kek = window.localStorage.getItem('ftKek')
  return kek
}

export function setGlabolKek (kek) {
  window.localStorage.setItem('ftKek', kek)
}

export async function getF1ByMne (mnemonic, kek, networkType, filecoinAddress0, index) {
  if (isFilecoinChain(networkType)) {
    const path = "m/44'/461'/0'/0"
    const f1 = genT1WalletByMne(mnemonic, filecoinAddress0, path, index)
    const { address, privateKey } = f1
    const pk = privateKeyEncode(privateKey, kek)
    const digest = await genPrivateKeyDigest(pk)
    return {
      address,
      privateKey: pk,
      digest
    }
  } else {
    const path = "m/44'/60'/0'/0"
    const ck = await genPrivateKeyFromMne(mnemonic, path, index)
    const pk = ck.toString('hex')
    const f1 = new Wallet(pk)
    const { address, privateKey } = f1
    const pkk = privateKeyEncode(privateKey, kek)
    const digest = await genPrivateKeyDigest(pkk)
    return {
      address,
      privateKey: pkk,
      digest
    }
  }
}

export async function getF1ByPrivateKey (privateKey, kek, networkType, filecoinAddress0) {
  try {
    if (isFilecoinChain(networkType)) {
      const f1 = genT1WalletByCK(privateKey, filecoinAddress0, [])
      const { address } = f1
      const pk = privateKeyEncode(privateKey, kek)
      const digest = await genPrivateKeyDigest(pk)
      return {
        address,
        privateKey: pk,
        digest
      }
    } else {
      const walletMnemonic = new Wallet(privateKey)
      const pk = privateKeyEncode(privateKey, kek)
      const digest = await genPrivateKeyDigest(pk)
      return {
        address: walletMnemonic.address,
        privateKey: pk,
        digest
      }
    }
  } catch (err) {
    return null
  }
}

export function getDecodePrivateKey (encodePrivateKey, kek, networkType, hex) {
  if (isFilecoinChain(networkType)) {
    const pk = privateKeyDecode(encodePrivateKey, kek)
    if (hex) {
      const privateKey = strToHexCharCode(pk)
      return privateKey
    } else {
      return pk
    }
  } else {
    const pk = privateKeyDecode(encodePrivateKey, kek)
    return pk
  }
}

export async function validatePassword (password, salt) {
  try {
    const _salt = genSalt(password)
    if (_salt === salt) {
      return true
    } else {
      return false
    }
  } catch (err) {
    return false
  }
}

export function strToHexCharCode (pk) {
  if (pk === '') return ''
  const obj = {
    Type: 'secp256k1',
    PrivateKey: pk
  }
  const str = JSON.stringify(obj)
  const hexCharCode = []
  for (let i = 0; i < str.length; i++) {
    hexCharCode.push((str.charCodeAt(i)).toString(16))
  }
  return hexCharCode.join('')
}

export function getQueryString (name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

export function formatDate (timestamp, second) {
  if (timestamp === '') return
  const date = new Date(timestamp * 1000)
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const h = date.getHours()
  const mm = date.getMinutes()
  const s = date.getSeconds()
  if (second) {
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
  } else {
    return y + '-' + add0(m) + '-' + add0(d)
  }
}

export function add0 (m) { return m < 10 ? '0' + m : m }

export function parseE (str) {
  if (!/[eE][+-]\d+$/.test(str)) {
    return str
  }
  str = String(str).toLowerCase()
  let [n, p] = str.split('e')
  const sign = p[0]
  const len = Number(p.slice(1))
  let r = ''
  if (sign === '+') {
    r = '1'
    for (let i = 0; i < len; i++) {
      r += '0'
    }
    n = n.replace('.', '')
    r = n + r.slice(n.length)
  } else {
    r = '0.'
    for (let i = 0; i < len; i++) {
      r += '0'
    }
    n = n.replace(/^0/, '')
    n = n.replace('.', '')
    r = r.slice(0, r.length - 1) + n
  }
  return r
}

export function isValidAddress (v, networkType) {
  if (!isFilecoinChain(networkType)) {
    let bol = false
    const start = v.startsWith('0x')
    if (start && v.length === 42) {
      bol = true
    }
    return bol
  } else {
    const str = trimStr(v)
    let bol = false
    if (str === '') return true
    const two = str.substr(0, 2)
    if (two === 't0' || two === 'f0') {
      bol = true
    }
    if ((two === 't1' || two === 'f1') && str.length === 41) {
      bol = true
    }
    if ((two === 't2' || two === 'f2') && str.length === 41) {
      bol = true
    }
    if ((two === 't3' || two === 'f3') && str.length === 86) {
      bol = true
    }
    return bol
  }
}

export function trimStr (str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

export function bigNumbers (val) {
  return new BigNumber(val)
}

export function fil2atto (v) {
  v = trim(String(v + ''))

  if (!isDecimal(v)) {
    return ''
  }
  v = v * Math.pow(10, 18)
  return parseE(v.toFixed(0))
}

export function isDecimal (str) {
  const r = /(^\d+(?:\.\d+)?([eE]-?\d+)?$|^\.\d+([eE]-?\d+)?$)/
  return r.test(str)
}
