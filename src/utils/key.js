
import * as CryptoJS from 'crypto-js'
import aesjs from 'aes-js'
const CTRCouterNumber = 6

export function privateKeyEncode(sk,kek){
  // let salt = genSalt(password)
  // let kek = genKek(password)
  let pk = AESEncrypt(sk,kek)
  return pk

  // let salt = genSalt(password)
  // let kek = genKek(password)
  // let skArr = skToArray(sk)
  // let xo = xor(kek,skArr)
  // let encodePrivateKey = CryptoJS.lib.WordArray.create(xo,32).toString(CryptoJS.enc.Base64);
  // return encodePrivateKey
}

export function privateKeyDecode(encodePrivateKey, kek){
  // let salt = genSalt(password)
  // let kek = genKek(password)
  let pk = AESDecrypt(encodePrivateKey,kek)
  return pk

  // let privateKeyArr = CryptoJS.enc.Base64.parse(encodePrivateKey)
  // let kek = genKek(password)
  // let ssk = xor(privateKeyArr.words,kek)
  // let ppk = CryptoJS.lib.WordArray.create(ssk,32).toString(CryptoJS.enc.Base64)
  // return ppk
}

export function genSalt(password)  {
    var str = `fiveToken${password}`;
    let hash = CryptoJS.SHA256(str)
    return hash.toString(CryptoJS.enc.Base64);
}

export function genKek(password) {
  let salt =  genSalt( password);
  let kek = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32
  });
  let kekString = CryptoJS.enc.Base64.stringify(kek);
  return kekString
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