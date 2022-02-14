/* eslint-disable no-undef */
import { BSCChainAPI } from '@/api/ethers'

it('ethers ', async () => {
  const privateKey = '0x8f867318b9326d4b8868b960187005f89ecf3d9bbf7fe963d627fcc1bdeb625d'
  const rpc = 'https://api.fivetoken.io'
  const bsc = new BSCChainAPI()
  bsc.setProvider(rpc)
  bsc.setWalletWithProvider(privateKey)
  const number = await bsc.getBlockNumber(rpc)
  console.log(number)
  expect(rpc).toBe(rpc)
})
