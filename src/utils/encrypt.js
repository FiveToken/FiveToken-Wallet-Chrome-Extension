import { getF1ByMne } from '@/utils'
import { isFilecoinChain } from './index'
import { decryptMessage, encrypt } from './aes-gcm'
import ExtensionStore from '@/utils/local-store'
export async function encryptCreate (options, sourceType, defaultNet) {
  const localStore = new ExtensionStore()
  const { accountName, password, mnemonicWords, networks, rpc } = options
  if (sourceType === 'recovery') {
    await localStore.clear()
    const networks = await localStore.get('networks')
    const defaultNetworks = defaultNet
    if (!networks) {
      localStore.set({ networks: defaultNetworks })
      localStore.set({ activeNetwork: defaultNetworks[0] })
    }
  }
  const ethereumF1 = await getF1ByMne(mnemonicWords, password, 'ethereum', '', 0)
  const filecoinF1 = await getF1ByMne(mnemonicWords, password, 'proxy', 'f', 0)
  const calibrationF1 = await getF1ByMne(mnemonicWords, password, 'proxy', 't', 0)
  const { address, privateKey, mnemonic } = filecoinF1
  const createTime = parseInt(new Date().getTime() / 1000)
  const _activeNetwork = await localStore.get('activeNetwork')
  const _activeAccount = {
    accountName,
    address,
    privateKey,
    rpc: sourceType === 'recovery' ? _activeNetwork.rpc : rpc,
    fil: 0,
    createTime,
    createType: 'mnemonic'
  }
  const _account = []
  const _networks = []
  for (const n of networks) {
    _networks.push({
      ...n,
      deriveIndex: 1
    })
    let item
    switch (n.filecoinAddress0) {
      case 'f':
        item = filecoinF1
        break
      case 't':
        item = calibrationF1
        break
      default:
        item = ethereumF1
        break
    }
    const { address, privateKey } = item
    _account.push({
      accountName,
      createTime,
      address,
      createType: 'mnemonic',
      privateKey,
      fil: 0,
      rpc: n.rpc
    })
  }
  const _walletKey = {
    address,
    mnemonicWords: mnemonic
  }
  const allAccountList = await localStore.get('accountList') || []
  await localStore.set({
    accountList: [
      ...allAccountList,
      ..._account
    ]
  })
  await localStore.set({ activeAccount: _activeAccount })
  await localStore.set({ networks: _networks })
  await localStore.set({
    activeNetwork: {
      ..._activeNetwork,
      deriveIndex: 1
    }
  })
  await localStore.set({ walletKey: _walletKey })
  return {
    account: _account,
    activeAccount: _activeAccount,
    networks: _networks,
    activeNetwork: {
      ..._activeNetwork,
      deriveIndex: 1
    }
  }
}

export async function importCreate (options) {
  const localStore = new ExtensionStore()
  const { encryptKey, accountList, networks, customNetwork, net } = options
  const { address, privateKey } = encryptKey
  const isExist = accountList.find(n => {
    return n.address === address
  })
  if (!isExist) {
    const { networkType, accountName } = customNetwork
    const customNetworkType = isFilecoinChain(networkType)
    const createTime = parseInt(new Date().getTime() / 1000)
    const _account = []
    networks.forEach(n => {
      const _networkType = isFilecoinChain(n.networkType)
      if (_networkType === customNetworkType) {
        const _address = customNetworkType ? n.filecoinAddress0 + address.substring(1, address.length) : address
        _account.push({
          accountName,
          address: _address,
          createType: 'privateKey',
          privateKey,
          fil: 0,
          createTime,
          rpc: n.rpc
        })
      }
    })
    const _activeAccount = {
      address,
      accountName,
      privateKey,
      createType: 'privateKey',
      fil: 0,
      createTime,
      rpc: net
    }
    const allAccountList = await localStore.get('accountList') || []
    // add table
    await localStore.set({
      accountList: [
        ...allAccountList,
        ..._account
      ]
    })
    await localStore.set({ activeAccount: _activeAccount })
    await localStore.set({ activeNetwork: customNetwork })
    return _account
  } else {
    return null
  }
}

export async function decryptByPrivateKey (privateKey, currentPassword, address) {
  try {
    const senderPublicKey = await encrypt(currentPassword, address)
    const decrypted = await decryptMessage(privateKey, senderPublicKey, address)
    return decrypted
  } catch (e) {
    return null
  }
}
