

import {trim,toFixed} from 'mytoolkit'

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

export function isValidAddress(v){
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
