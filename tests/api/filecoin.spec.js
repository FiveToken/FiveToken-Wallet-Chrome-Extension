/* eslint-disable no-undef */
import { FilecoinAPI } from '@/api/filecoin'
test('api ', async () => {
  const FilecoinApi = new FilecoinAPI()
  const rpc = 'https://api.fivetoken.io'
  const address = 'f134ljmsuc6ab45jiaf2qjahs3j2vl6jv7pm5oema'
  const cid = 'bafy2bzacec6tqqexafkpahko3kvafbkrl7bzs7nmkdgld5rs4xibylpnvlu7u'
  FilecoinApi.setRpc(rpc)
  expect(FilecoinApi.rpc).toBe(rpc)
  await FilecoinApi.getStateNetworkName()
  await FilecoinApi.getBalance(address)
  await FilecoinApi.stateGetReceipt(cid)
  await FilecoinApi.chainGetMessage(cid)
})
