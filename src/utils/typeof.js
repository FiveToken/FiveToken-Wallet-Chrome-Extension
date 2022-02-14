export function Uint8ArrayToString (fileData) {
  let dataString = ''
  for (let i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i])
  }

  return dataString
}

export function stringToUint8Array (str) {
  const arr = []
  for (let i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i))
  }
  const tmpUint8Array = new Uint8Array(arr)
  return tmpUint8Array
}

export function ArrayBufferToString (buffer) {
  return String.fromCharCode.apply(null, new Uint8Array(buffer))
}

export function StringToArrayBuffer (str) {
  const buf = new ArrayBuffer(str.length) // 每个字符占用2个字节
  const bufView = new Uint8Array(buf)
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}
