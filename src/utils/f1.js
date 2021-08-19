
import * as CryptoJS from 'crypto-js';
// import sha256 from 'crypto-js/sha256';
import blake from 'blakejs'
import * as bip39 from 'bip39'
import base32Encode from 'base32-encode'
import { Buffer } from 'buffer'
import hdkey from 'ethereumjs-wallet/hdkey'
import * as ethutil from 'ethereumjs-util'
import {
    tail
} from 'mytoolkit'

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
        privateKey: privateStr
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


export async function genPrivateKeyDigest(privateKey) {
  let digest = CryptoJS.SHA256(privateKey).toString(CryptoJS.enc.Base64)
  return digest.substring(0,16);
}
