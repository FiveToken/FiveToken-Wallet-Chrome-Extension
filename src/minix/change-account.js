import { mapMutations } from 'vuex'
import ExtensionStore from '@/utils/local-store'
export default {
  methods: {
    ...mapMutations('app', [
      'SET_ACTIVEACCOUNT',
      'SET_PRIVATEKEY',
      'SET_ADDRESS',
      'SET_DIGEST',
      'SET_ACCOUNTNAME'
    ]),
    async minixChangeAccount (item) {
      const localStore = new ExtensionStore()
      this.SET_ACTIVEACCOUNT(item)
      this.SET_PRIVATEKEY(item.privateKey)
      this.SET_ADDRESS(item.address)
      this.SET_ACCOUNTNAME(item.accountName)
      await localStore.set({ activeAccount: item })
    }
  }
}
