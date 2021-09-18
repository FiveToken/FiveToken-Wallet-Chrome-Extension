<template>
    <div class="layout-compontent">
        <slot/>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { Database } from '@/utils/database.js'
export default {
  name: 'ky-layout',
  data () {
    return { }
  },
  async created () {
    const language = window.localStorage.getItem('fiveTokenLanguage')
    const currency = window.localStorage.getItem('fiveTokenCurrency')
    this.SET_LANGUAGE(language)
    this.SET_CURRENCY(currency)

    const db = new Database()
    const networks = await db.getTable('networks', { khazix: 'khazix' })
    const activenNetworks = await db.getTable('activenNetworks', { khazix: 'khazix' })
    const defaultNetworks = this.$t('defaultNetworks')
    if (!networks.length) {
      db.bulkAddTable('networks', defaultNetworks)
    }
    if (!activenNetworks.length) {
      const _first = defaultNetworks.length && defaultNetworks[0]
      db.addTable('activenNetworks', _first)
    } else {
      this.SET_ACTIVENETWORKS(activenNetworks)
      const rpc = activenNetworks[0].rpc
      const rpcName = activenNetworks[0].name
      const symbol = activenNetworks[0].symbol
      const ids = activenNetworks[0].ids
      const browser = activenNetworks[0].browser
      const networkType = activenNetworks[0].networkType
      const filecoinAddress0 = activenNetworks[0].filecoinAddress0
      const decimals = activenNetworks[0].decimals
      const image = activenNetworks[0].image
      const disabled = activenNetworks[0].disabled
      const deriveIndex = activenNetworks[0].deriveIndex
      this.SET_RPC(rpc)
      this.SET_RPCNAME(rpcName)
      this.SET_NETWORKS(networks)
      const accountList = await db.getTable('accountList', { rpc, isDelete: 0 })
      this.SET_ACCOUNTLIST(accountList)
      this.SET_SYMBOL(symbol)
      this.SET_IDS(ids)
      this.SET_BROWSER(browser)
      this.SET_NETWORKTYPE(networkType)
      this.SET_FILECOINADDRESS0(filecoinAddress0)
      this.SET_DECIMALS(decimals)
      this.SET_OWENCHAIN(disabled)
      this.SET_RPCIMAGE(image)
      this.SET_DERIVEINDEX(deriveIndex)
    }

    const activeAccount = await db.getTable('activeAccount', { khazix: 'khazix' })
    if (activeAccount.length) {
      this.SET_ACTIVEACCOUNT(activeAccount)
      const address = activeAccount[0].address
      const privateKey = activeAccount[0].privateKey
      const digest = activeAccount[0].digest
      const accountName = activeAccount[0].accountName

      this.SET_PRIVATEKEY(privateKey)
      this.SET_ADDRESS(address)
      this.SET_DIGEST(digest)
      this.SET_ACCOUNTNAME(accountName)
    }
    this.$emit('layoutMounted')
  },
  methods: {
    ...mapMutations('app', [
      'SET_ACTIVENETWORKS',
      'SET_RPC',
      'SET_RPCNAME',
      'SET_ACTIVEACCOUNT',
      'SET_ACCOUNTLIST',
      'SET_PRIVATEKEY',
      'SET_ADDRESS',
      'SET_DIGEST',
      'SET_ACCOUNTNAME',
      'SET_SYMBOL',
      'SET_IDS',
      'SET_BROWSER',
      'SET_NETWORKS',
      'SET_NETWORKTYPE',
      'SET_FILECOINADDRESS0',
      'SET_LANGUAGE',
      'SET_CURRENCY',
      'SET_DECIMALS',
      'SET_OWENCHAIN',
      'SET_RPCIMAGE',
      'SET_DERIVEINDEX'
    ])
  }
}
</script>
<style lang="less" scoped>
.layout-compontent{
    height: 100%;
}
</style>
