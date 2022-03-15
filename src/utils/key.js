import * as CryptoJS from 'crypto-js'

export function genSalt (password) {
  const str = `fiveToken${password}`
  const hash = CryptoJS.SHA256(str)
  return hash.toString(CryptoJS.enc.Base64)
}

export function genKek (password) {
  const salt = genSalt(password)
  const kek = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32
  })
  const kekString = CryptoJS.enc.Base64.stringify(kek)
  return kekString
}
