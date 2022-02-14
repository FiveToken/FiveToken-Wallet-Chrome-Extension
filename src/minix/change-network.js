import { mapMutations } from 'vuex'
import ExtensionStore from '@/utils/local-store'
export default {
  methods: {
    ...mapMutations('app', [
      'SET_RPC',
      'SET_RPCNAME',
      'SET_BROWSER',
      'SET_ACCOUNTLIST',
      'SET_SYMBOL',
      'SET_IDS',
      'SET_NETWORKTYPE',
      'SET_FILECOINADDRESS0',
      'SET_ACTIVENETWORK',
      'SET_DECIMALS',
      'SET_OWENCHAIN',
      'SET_RPCIMAGE',
      'SET_DERIVEINDEX'
    ]),
    async minixChangeNetwork (item) {
      const localStore = new ExtensionStore()
      await localStore.set({ activeNetwork: item })
      const accountList = await localStore.get('accountList')
      if (accountList) {
        const myAccountList = accountList.filter(n => n.rpc === item.rpc)
        this.SET_ACCOUNTLIST(myAccountList)
      }
      this.SET_RPC(item.rpc)
      this.SET_RPCNAME(item.name)
      this.SET_BROWSER(item.browser)
      this.SET_SYMBOL(item.symbol)
      this.SET_IDS(item.ids)
      this.SET_NETWORKTYPE(item.networkType)
      this.SET_FILECOINADDRESS0(item.filecoinAddress0)
      this.SET_ACTIVENETWORK(item)
      this.SET_DECIMALS(item.decimals)
      this.SET_OWENCHAIN(item.disabled)
      this.SET_RPCIMAGE(item.image)
      this.SET_DERIVEINDEX(item.deriveIndex)
    }
  }
}
