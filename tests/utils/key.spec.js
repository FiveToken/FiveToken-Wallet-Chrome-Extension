/* eslint-disable no-undef */
import { saltKey, genKek } from '@/utils/key'
test('fn Uint8ArrayToString, stringToUint8Array ', async () => {
  const saltKey1 = '724b092810ec86d7e35c9d067702b31ef90bc43a7b598626749914d6a3e033ed'
  const password = '1234567890'
  const encrypt = 'ZeuOnH3ACW8uK33oQo0s/NCJRru9bGXqBdkQZ1EpBpA='
  const encryptPassword = genKek(password)
  expect(encryptPassword).toBe(encrypt)
  expect(saltKey).toBe(saltKey1)
})
