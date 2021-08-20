

import {trim,toFixed} from 'mytoolkit'
import { 
  genT1WalletByMne,
  genT1WalletByCK,
  genPrivateKeyFromMne,
  genPrivateKeyDigest,
} from '@/utils/f1'
import {
  privateKeyEncode,
  privateKeyDecode,
  genSalt
} from '@/utils/key'
import { Wallet } from "ethers";

const encodeKey = 'five'
export const fiveTokenVersion = '1.1.0'

export const minimumPrecision = 0.00000001

export function formatNumber(str,n){
  let index = str.indexOf('.')
  if(index > -1){
      let arr = str.split(".")
      let num = arr[0] + "." + arr[1].substring(0,n)
      return Number(num)
  }else{
      return Number(str)
  }
}

export function isProxy(networkType){
  return networkType === 'proxy'
}

export function isFilecoinChain(networkType){
  return (networkType === 'proxy' || networkType === 'filecoin')
}

export function getGlobalKek(){
  let kek = window.localStorage.getItem('ftKek');
  return kek
}

export function setGlabolKek(kek){
  window.localStorage.setItem('ftKek', kek);
}

export async function getF1ByMne(mnemonic,kek,networkType,filecoinAddress0,index) {
  if(isFilecoinChain(networkType)){
    let path = "m/44'/461'/0'/0"
    let f1 = genT1WalletByMne(mnemonic,filecoinAddress0,path,index)
    let { address,privateKey } = f1
    let pk = privateKeyEncode(privateKey,kek)
    let digest = await genPrivateKeyDigest(pk)
    return {
      address,
      privateKey:pk,
      digest
    }
  }else{
    let path = "m/44'/60'/0'/0"
    let ck = await genPrivateKeyFromMne(mnemonic,path,index)
    let pk = ck.toString("hex")
    let f1 = new Wallet(pk)
    let { address,privateKey } = f1
    let pkk = privateKeyEncode(privateKey,kek)
    let digest = await genPrivateKeyDigest(pkk)
    return {
      address,
      privateKey:pkk,
      digest
    }
  }
}

export async function getF1ByPrivateKey(privateKey,kek,networkType,filecoinAddress0) { 
  try{
    if(isFilecoinChain(networkType)){
      let f1 = genT1WalletByCK(privateKey,filecoinAddress0,[])
      let { address } = f1
      let pk = privateKeyEncode(privateKey,kek)
      let digest = await genPrivateKeyDigest(pk)
      return {
        address,
        privateKey:pk,
        digest
      }
    }else{
      let walletMnemonic = new Wallet(privateKey)
      let pk = privateKeyEncode(privateKey,kek)
      let digest = await genPrivateKeyDigest(pk)
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

export function getDecodePrivateKey(encodePrivateKey,kek,networkType,hex) {
  if(isFilecoinChain(networkType)){
    let pk = privateKeyDecode(encodePrivateKey,kek)
    let privateKey1 = strToHexCharCode(pk)
    console.log(privateKey1,'privateKey 123456')
    if(hex){
      let privateKey = strToHexCharCode(pk)
      return privateKey
    }else{
      return pk
    }
  }else{
    let pk = privateKeyDecode(encodePrivateKey,kek)
    return pk
  }
}

export async function validatePassword(password,salt) {
  try{
    let _salt = genSalt(password)
    if(_salt === salt){
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

export function getQueryString(name) { 
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
  var r = window.location.search.substr(1).match(reg); 
  if (r != null) return unescape(r[2]); 
  return null; 
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


export function add0(m){return m<10?'0'+m:m }


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