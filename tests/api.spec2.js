/* eslint-disable no-undef */
import { GlobalApi } from '@/api'

test('fn GlobalApi()', async () => {
  const MyGlobalApi = new GlobalApi()
  MyGlobalApi.setRpc('https://data-seed-prebsc-1-s1.binance.org:8545')
  MyGlobalApi.setNetworkType('ethereum')
  const res = await MyGlobalApi.getPrice('binancecoin')
  expect(res).toEqual({
    cn: ''
  })
})
