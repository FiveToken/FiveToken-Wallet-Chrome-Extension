/* eslint-disable no-undef */
import { genKek } from '@/utils/key'
test('fn Uint8ArrayToString, stringToUint8Array ', async () => {
  const password = '1234567890'
  const encrypt = 'ZeuOnH3ACW8uK33oQo0s/NCJRru9bGXqBdkQZ1EpBpA='
  const encryptPassword = genKek(password)
  expect(encryptPassword).toBe(encrypt)
})
