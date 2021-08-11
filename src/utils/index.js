

import {trim,toFixed} from 'mytoolkit'
import { genT1WalletByMne,genT1WalletByCK,AESEncrypt,AESDecrypt,genPrivateKeyFromMne } from '@/utils/f1'
import { privateKeyEncode,privateKeyDecode ,genPrivateKeyDigest,validatePrivateKey} from '@/utils/key'
import { Wallet } from "ethers";
const encodeKey = 'five'
export const fiveTokenVersion = '1.1.0'

export function isProxy(networkType){
  return networkType === 'proxy'
}

export function isFilecoinChain(networkType){
  return (networkType === 'proxy' || networkType === 'filecoin')
}

export async function enCodeMnePsd(mne,psd){
  let mnemonic = await AESEncrypt(mne,encodeKey)
  let password = await AESEncrypt(psd,encodeKey)
  return {
    mnemonic,
    password
  }
}

export async function deCodeMnePsd(mne,psd){
  let mnemonic = AESDecrypt(mne,encodeKey)
  let password = AESDecrypt(psd,encodeKey)
  return {
    mnemonic,
    password
  }
}

export async function getF1ByMne(mnemonic,password,networkType,filecoinAddress0,index) {
  if(isFilecoinChain(networkType)){
    let path = "m/44'/461'/0'/0"
    let f1 = genT1WalletByMne(mnemonic,filecoinAddress0,path,index)
    let { address,privateKey } = f1
    let pk = privateKeyDecode(privateKey,address,password)
    let digest = await genPrivateKeyDigest(privateKey)
    return {
      address,
      privateKey:pk,
      digest
    }
  }else{
    let path = "m/44'/60'/0'/0"
    let ck = await genPrivateKeyFromMne(mnemonic,path,index)
    let privateKey = ck.toString("hex")
    let f1 = new Wallet(privateKey)
    let { address } = f1
    let pk = AESEncrypt(privateKey,password)
    let digest = await genPrivateKeyDigest(privateKey)
    return {
      address,
      privateKey:pk,
      digest
    }
  }
}

export async function getF1ByPrivateKey(privateKey,password,networkType,filecoinAddress0) { 
  try{
    if(isFilecoinChain(networkType)){
      let f1 = genT1WalletByCK(privateKey,filecoinAddress0,[])
      let { address } = f1
      let pk = privateKeyDecode(privateKey,address,password)
      let digest = await genPrivateKeyDigest(privateKey)
      return {
        address,
        privateKey:pk,
        digest
      }
    }else{
      let walletMnemonic = new Wallet(privateKey)
      let pk = AESEncrypt(privateKey,password)
      let digest = await genPrivateKeyDigest(privateKey)
      return {
        address:walletMnemonic.address,
        privateKey:pk,
        digest
      }
    }
  }catch(err){
    return null
  }
}

export async function validatePassword(psd,password) {
  try{
    if(psd === password){
      return true
    }else{
      return false
    }
  }catch(err){
    return false
  }
}

function strToHexCharCode(pk) {
　　if(pk === "") return "";
    let obj = {
        Type:'secp256k1',
        PrivateKey:pk
    }
    let str = JSON.stringify(obj)
　　var hexCharCode = [];
　　for(var i = 0; i < str.length; i++) {
　　　　hexCharCode.push((str.charCodeAt(i)).toString(16));
　　}
　　return hexCharCode.join("");
}

export function getPrivateKey(encodePrivateKey,address,password,networkType,hex) { 
  if(isFilecoinChain(networkType)){
    let pk = privateKeyDecode(encodePrivateKey,address,password)
    if(hex){
      let privateKey = strToHexCharCode(pk)
      return privateKey
    }else{
      return pk
    }
  }else{
    let pk = AESDecrypt(encodePrivateKey,password)
    return pk
  }
}

export function getQueryString(name) { 
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
  var r = window.location.search.substr(1).match(reg); 
  if (r != null) return unescape(r[2]); 
  return null; 
}

export function getNowFormatDateEn() {
  let date = new Date();
  let seperator = "-";
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let currentdate = add0(month) + seperator + add0(day) + seperator + year  ;
  return currentdate;
}

export function formatDate(timestamp,second){
  if(timestamp === '') return
  let date = new Date(timestamp * 1000);
  let y = date.getFullYear();
  let m = date.getMonth()+1;
  let d = date.getDate() ;
  let h = date.getHours();
  let mm = date.getMinutes();
  let s = date.getSeconds();
  if(second){
      return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':'+ add0(s);
  }else{
      return y + '-' + add0(m) + '-' + add0(d);
  }
}

export function formatDateEn(timestamp){
  if(timestamp === '') return
  let date = new Date(timestamp * 1000);
  let y = date.getFullYear();
  let m = date.getMonth()+1;
  let d = date.getDate() ;
  let h = date.getHours();
  let mm = date.getMinutes();
  let s = date.getSeconds();
  return add0(m) + '-' + add0(d)+ '-' + y
}

export function add0(m){return m<10?'0'+m:m }

export function formatFilNum(num, size = 5) {
  num = parseE(String(num))
  let dot = String(num).split('.')[1]
  let zero = 1
  if (dot) {
      for (let v of dot) {
          if (Number(v) !== 0) {
              break
          } else {
              zero++
          }
      }
      if (zero <= 5) {
          return fixedFloat(num,size) + ' FIL'
      } else if (zero > 5 && zero <= 13) {
          return fixedFloat((Number(num) * Math.pow(10, 9)),size) + ' nanoFIL'
      } else {
          return fixedFloat((Number(num) * Math.pow(10, 18)),size) + ' attoFIL'
      }
  } else {
      return num + ' FIL'
  }
}


export function parseE(str) {
  if(!/[eE][+-]\d+$/.test(str)){
    return str 
  }
  str = String(str).toLowerCase()
  let [n, p] = str.split('e')
  let sign = p[0]
  let len = Number(p.slice(1))
  let r = ""
  if(sign === '+') {
    r = "1"
    for(let i = 0; i < len; i++) {
      r += "0"
    }
    n = n.replace('.', '')
    r = n + r.slice(n.length)
  }else{
    r = "0."
    for(let i = 0; i < len; i++) {
      r += "0"
    }
    n = n.replace(/^0/, '')
    n = n.replace('.', '')
    r = r.slice(0, r.length - 1) + n
  }
  return r 
}

function fixedFloat(num,size=2){
  const [int,dot]=String(num).split('.')
  if(dot){
    return Number(int)- -parseFloat('0.'+dot).toPrecision(size)
  }else{
    return num
  }
}

export function isValidAddress(v,networkType){
  console.log(v,networkType,'v,networkType')
  if(!isFilecoinChain(networkType)){
    let bol = false
    let start = v.startsWith('0x')
    if(start && v.length === 42){
      bol = true
    }
    return bol
  }else{
    let str = trimStr(v)
    let bol = false
    if(str === '') return true
    let two = str.substr(0, 2)
    if(two === 't0' || two === 'f0'){
        bol = true
    }
    if((two === 't1' || two === 'f1') && str.length === 41){
        bol = true
    }
    if((two === 't2' || two === 'f2') && str.length === 41){
      bol = true
    }
    if((two === 't3' || two === 'f3') && str.length === 86){
        bol = true
    }
    return bol
  }
}

export function trimStr(str){
    return str.replace(/(^\s*)|(\s*$)/g, "") 
}

export function fil2atto(v) {
  v = trim(String(v + ''))
  
  if(!isDecimal(v)) {
    return ""
  }
  v = v * Math.pow(10, 18)
  return parseE(v.toFixed(0))
}

export function isDecimal(str) {
  let r = /(^\d+(?:\.\d+)?([eE]-?\d+)?$|^\.\d+([eE]-?\d+)?$)/
  return r.test(str)
}

export function getGasLimit(actor_exist,gas_used){
  let gas = (Number(gas_used))*1.25
  let gas_limit = actor_exist ? Math.floor(gas) : 2200000;
  return gas_limit
}
// this.gasFeeCap(res.base_fee,base_fee_ratio,nano_ratio,gas_premium,gasLimit)
export function getGasFeeCap(base_fee,base_fee_ratio,gas_premium,gasLimit,networkType){
    // let gasfee_cap = Math.max(base_fee_ratio * Number(base_fee), nano_ratio * Math.pow(10, 9));
    try{
      if(!isFilecoinChain(networkType)){
        return base_fee * gasLimit
      }else{
        let gasfee_cap = base_fee_ratio * base_fee + gas_premium
        return gasfee_cap
      }
    }catch(err){
      console.log(err,'getGasFeeCap。err')
    }
    
    
}


export function getGasPremium(){
  let gas_premium = Math.pow(10, 6)
  return gas_premium
}