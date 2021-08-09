
import * as CryptoJS from 'crypto-js';
import sha256 from 'crypto-js/sha256';
import blake from 'blakejs'
import * as bip39 from 'bip39'
import base32Encode from 'base32-encode'
// import base32Decode from 'base32-decode'
import { Buffer } from 'buffer'
import hdkey from 'ethereumjs-wallet/hdkey'
import * as ethutil from 'ethereumjs-util'
import {
    tail
} from 'mytoolkit'
import aesjs from 'aes-js'
const CTRCouterNumber = 6

export function getQueryString(name) { 
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
  var r = window.location.search.substr(1).match(reg); 
  if (r != null) return unescape(r[2]); 
  return null; 
} 
export function  genMnemonic() {
    return bip39.generateMnemonic()
}
export function genT1WalletByMne(mne,filecoinAddress0,path,index) {
    let ck = genPrivateKeyFromMne(mne,path,index)
    let privateStr = ck.toString("base64")
    let pubkey = privateToPublicKey(ck)
    let address = getAddressByPublicKey(pubkey)
    const encode_prefix = filecoinAddress0
    address = `${encode_prefix}1${address}`;
    let count = 1
    return {
        label: `Filecoin-wallet ${count}`,
        count,
        type: '1',
        address: address,
        default: 1,
        walletType: 0,
        privateKey: privateStr//privateKeyEncode(privateStr,address,password),
    }
}

export function genT1WalletByCK(ck,filecoinAddress0,walletList) {
  let privateStr = ck
  let pk = Buffer.from(ck, "base64");
  let pubkey = ethutil.privateToPublic(pk)
  let address = getAddressByPublicKey(pubkey)
  const encode_prefix = filecoinAddress0
  address = `${encode_prefix}1${address}`;
  let count = 1
  if (walletList.length > 0) {
    let lastWallet = tail(walletList)
    let lastWalletCount = lastWallet.count || walletList.length
    count = lastWalletCount + 1
  }
  return {
    label: `Filecoin-wallet ${count}`,
    count,
    type: '1',
    address: address,
    walletType: 0,
    default: 1,
    privateKey: privateStr
  }
}

export function genPrivateKeyFromMne(mne,path,index) {
  // m/44'/461'/0'/0
  // m/44'/60'/0'/0
  let fileCoinDerivePath = path
  let seed = bip39.mnemonicToSeedSync(mne)
  let rootKey = hdkey.fromMasterSeed(seed)
  let deriveKey = rootKey.derivePath(fileCoinDerivePath)
  let k0 = deriveKey.deriveChild(index)
  return Buffer.from(k0._hdkey._privateKey)
}

export function privateToPublicKey(ck) {
  return ethutil.privateToPublic(ck)
}
export function getAddressByPublicKey(pubkey) {
  let pk = Array.from(pubkey)
  pk.unshift(4)
  let address = blake2b(Uint8Array.from(pk), 20)
  let add = Array.from(address)
  add.unshift(1)
  let cksm = blake2b(Uint8Array.from(add), 4)
  let addressArr = Array.from(address)
  let cksmArr = Array.from(cksm)
  //console.log(array2hex(addressArr), array2hex(cksmArr))
  let addrBuff = Uint8Array.from(addressArr.concat(cksmArr))
  return base32Encode(addrBuff, 'RFC4648', {
    padding: false
  }).toLowerCase()
}

export function blake2b(arr, len) {
  return blake.blake2b(arr, null, len)
}

export function AESEncrypt(word, key) {
  let keyMD5 = CryptoJS.MD5(key).toString()
  let keyBytes = aesjs.utils.hex.toBytes(keyMD5)
  let wordBytes = aesjs.utils.utf8.toBytes(word)
  let aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter(CTRCouterNumber))
  let encryptedData = aesCtr.encrypt(wordBytes)
  let encryptedStr = aesjs.utils.hex.fromBytes(encryptedData)
  return encryptedStr
}

export function AESDecrypt(encryptedData, key) {
  let keyMD5 = CryptoJS.MD5(key).toString()
  let keyBytes = aesjs.utils.hex.toBytes(keyMD5)
  let encryptedBytes = aesjs.utils.hex.toBytes(encryptedData)
  let aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter(CTRCouterNumber))
  let decryptedBytes = aesCtr.decrypt(encryptedBytes)
  let decryptedStr = aesjs.utils.utf8.fromBytes(decryptedBytes)
  return decryptedStr
}

export function privateKeyDecode(encodePrivateKey,addrress, password){
  let kek = genKek(addrress,password)
  // let encodePrivateKey = localStorage.getItem('encodePrivateKey')
  let privateKeyArr = CryptoJS.enc.Base64.parse(encodePrivateKey)
  let ssk = xor(privateKeyArr.words,kek)
  let ppk = CryptoJS.lib.WordArray.create(ssk,32).toString(CryptoJS.enc.Base64)
  return ppk
}

export function privateKeyEncode(sk,address, password){
  let salt = genSalt(address,password)
  let kek = genKek(address,password)
  let skArr = skToArray(sk)
  let xo = xor(kek,skArr)
  let encodePrivateKey = CryptoJS.lib.WordArray.create(xo,32).toString(CryptoJS.enc.Base64);
  localStorage.setItem('encodePrivateKey',encodePrivateKey)
  return encodePrivateKey
}
export function genSalt(address, password)  {
    var str = `${address}filwalllet${password}`;
    let hash = sha256(str)
    return hash.toString(CryptoJS.enc.Base64);
}

export function genKek(address, password) {
    let salt =  genSalt(address, password);
    let kek = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32
      });
    return kek.words;
}

export function skToArray(sk) {
    let skarr = CryptoJS.enc.Base64.parse(sk)
    return skarr.words;
}

export function xor(first, second) {
    var list = [];
    for (var i = 0; i < first.length; i++) {
      var ele = first[i];
      var ele2 = second[i];
      var res = ele ^ ele2;
      list.push(res);
    }
    return list;
}
  
export async function validatePrivateKey(addrress, password, skKek, dig)  {
  var sk = await getPrivateKey(addrress, password, skKek);
  console.log(sk,'sss kkkk')
  var digest = await genPrivateKeyDigest(sk);
  if (dig != digest) {
    return false;
  } else {
    return true;
  }
}

export async function genPrivateKeyDigest(privateKey) {
  let digest = sha256(privateKey).toString(CryptoJS.enc.Base64)
  return digest.substring(0,16);
}

export async function getPrivateKey(addr,pass,skKek,)  {
  var skBytes = CryptoJS.enc.Base64.parse(skKek);
  var kek = await genKek(addr, pass);
  var sk = xor(skBytes.words, kek);
  return CryptoJS.lib.WordArray.create(sk,32).toString(CryptoJS.enc.Base64);
}


export function decodePrivate(pk) {
  return pk.toString(CryptoJS.enc.Base64)
}