/* eslint-disable no-undef */
import { Uint8ArrayToString, stringToUint8Array, ArrayBufferToString, StringToArrayBuffer } from '@/utils/typeof'
test('fn Uint8ArrayToString, stringToUint8Array ', async () => {
  const nameString = 'fiveToken'
  const nameUnit8Array = stringToUint8Array(nameString)
  const resString = Uint8ArrayToString(nameUnit8Array)
  expect(resString).toBe(nameString)
})

test('fn ArrayBufferToString, StringToArrayBuffer ', async () => {
  const address = 'f1ipv4zxpdl47c6clbixbxsdpc7a6d6hf5l77ykhq'
  const addressBuffer = StringToArrayBuffer(address)
  const decypedAddress = ArrayBufferToString(addressBuffer)
  expect(decypedAddress).toBe(address)
})
