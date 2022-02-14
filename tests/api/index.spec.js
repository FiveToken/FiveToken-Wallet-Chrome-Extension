/* eslint-disable no-undef */
import { GlobalApi } from '@/api/index'
import { createLocalVue } from '@vue/test-utils'
import elementUI from 'element-ui'
import Vuex from 'vuex'
const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(elementUI)
global.document = jest.fn()

// Set up a mock window
global.window = document.defaultView
global.window.location = 'https://fivetoken.co/'

test('api ', async () => {
  const rpc = 'https://api.fivetoken.io'
  const networkType = 'proxy'
  const MyGlobalApi = new GlobalApi()
  MyGlobalApi.setRpc(rpc)
  MyGlobalApi.setNetworkType(networkType)
  // const address = 'f134ljmsuc6ab45jiaf2qjahs3j2vl6jv7pm5oema'
  // const res = await MyGlobalApi.getBalance(address)
  // console.log(res)
})
