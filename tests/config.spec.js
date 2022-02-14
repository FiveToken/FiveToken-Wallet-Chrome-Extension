/* eslint-disable no-undef */
import Config from '@/config'
test('config ', async () => {
  const { baseFeePerGasToMaxFeePerGas } = Config
  expect(baseFeePerGasToMaxFeePerGas).toBe(1.15)
})
