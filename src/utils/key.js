
import * as CryptoJS from 'crypto-js'
import sha256 from 'crypto-js/sha256';

export function privateKeyEncode(sk,address, password){
  let salt = genSalt(address,password)
  let kek = genKek(address,password)
  let skArr = skToArray(sk)
  let xo = xor(kek,skArr)
  let encodePrivateKey = CryptoJS.lib.WordArray.create(xo,32).toString(CryptoJS.enc.Base64);
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

export function privateKeyDecode(encodePrivateKey,address, password){
  let kek = genKek(address,password)
  let privateKeyArr = CryptoJS.enc.Base64.parse(encodePrivateKey)
  let ssk = xor(privateKeyArr.words,kek)
  let ppk = CryptoJS.lib.WordArray.create(ssk,32).toString(CryptoJS.enc.Base64)
  return ppk
}

export async function validatePrivateKey(address, password, skKek, dig)  {
  var sk = await getPrivateKey(address, password, skKek);
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

















// import * as CryptoJS from 'crypto-js';
// import sha256 from 'crypto-js/sha256';

// export function genSalt(addr, pass)  {
//     var str = `${addr}filwalllet${pass}`;
//     let hash = sha256(str)
//     return hash.toString(CryptoJS.enc.Base64);
// }

// export async function genPrivateKeyDigest(privateKey) {
//     let hash = await sha256.hash(
//       base64Decode(privateKey),
//     );
//     return base64Encode(hash.bytes.sublist(0, 16));
// }

// export function genKek(addr, pass) {
//     let salt =  genSalt(addr, pass);
//     let kek = CryptoJS.PBKDF2(pass, salt, {
//         keySize: 256 / 32
//       });
//     return kek.words;
// }



// export function skToArray(sk) {
//     let skarr = CryptoJS.enc.Base64.parse(sk)
//     return skarr.words;
// }

// export function xor(first, second) {
//     var list = [];
//     for (var i = 0; i < first.length; i++) {
//       var ele = first[i];
//       var ele2 = second[i];
//       var res = ele ^ ele2;
//       list.push(res);
//     }
//     var wordArray = CryptoJS.lib.WordArray.create(list,32).toString(CryptoJS.enc.Base64);
//     localStorage.setItem('wordArray',wordArray)
//     // console.log(wordArray,'wordArray')
//     return list;
// }

// export function decWords(addr, pass){
//     let kek = genKek(addr,pass)
//     let wordstr = localStorage.getItem('wordArray')
//     let wordArray = CryptoJS.enc.Base64.parse(wordstr)
//     let ss = xor(wordArray.words,kek)
//     let un = CryptoJS.lib.WordArray.create(ss,32).toString(CryptoJS.enc.Base64)
//     console.log(un,'ununununun')

// }
  
// export async function validatePrivateKey(addr, pass, skKek, dig)  {
//     var sk = await getPrivateKey(addr, pass, skKek);
//     var digest = await genPrivateKeyDigest(sk);
//     if (dig != digest) {
//       return false;
//     } else {
//       return true;
//     }
// }
  
// export async function getPrivateKey(addr,pass,skKek,)  {
//     var skBytes = base64Decode(skKek);
//     var kek = await genKek(addr, pass);
//     var sk = xor(skBytes, kek);
//     return sk;
// }
  

// export function decodePrivate(pk) {
//     return base64Decode(pk);
// }

// export function genT1WalletByCK(ck, hash, walletList) {
//   let privateStr = ck
//   let pk = Buffer.from(ck, "base64");
//   let pubkey = ethutil.privateToPublic(pk)
//   let address = getAddressByPublicKey(pubkey)
//   address = `${encode_prefix}1${address}`;
//   let count = 1
//   if (walletList.length > 0) {
//     let lastWallet = tail(walletList)
//     let lastWalletCount = lastWallet.count || walletList.length
//     count = lastWalletCount + 1
//   }
  
//   return {
//     label: `Filecoin-wallet ${count}`,
//     count,
//     type: '1',
//     address: address,
//     walletType: 0,
//     default: 1,
//     privateKey: AESEncrypt(privateStr, hash),
//   }
// }