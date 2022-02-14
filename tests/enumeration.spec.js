/* eslint-disable no-undef */
import { enumerateNetworkType } from '@/enumeration'
test('fn Uint8ArrayToString, stringToUint8Array ', async () => {
  const { filecoin } = enumerateNetworkType
  expect(filecoin).toBe('filecoin')
})
