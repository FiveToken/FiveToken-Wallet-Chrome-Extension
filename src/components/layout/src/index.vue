<template>
    <div class="layout-compontent">
        <noNetwork v-if="!onLine"/>
      <slot/>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import noNetwork from '@/components/no-network/src/index.vue'
import ExtensionStore from '@/utils/local-store'
export default {
  name: 'KyLayout',
  components: {
    noNetwork
  },
  data () {
    return { }
  },
  computed: {
    ...mapState('app', ['onLine'])
  },
  async created () {
    const language = window.localStorage.getItem('fiveTokenLanguage')
    const currency = window.localStorage.getItem('fiveTokenCurrency')
    this.SET_LANGUAGE(language)
    this.SET_CURRENCY(currency)

    const localStore = new ExtensionStore()
    const networks = await localStore.get('networks')
    const activeNetwork = await localStore.get('activeNetwork')
    const defaultNetworks = this.$t('defaultNetworks')
    if (!networks) {
      localStore.set({ networks: defaultNetworks })
    }
    if (activeNetwork) {
      this.SET_ACTIVENETWORK(activeNetwork)
      this.SET_RPC(activeNetwork.rpc)
      this.SET_RPCNAME(activeNetwork.name)
      this.SET_NETWORKS(networks)
      const accountList = await localStore.get('accountList')
      if (accountList) {
        const myAccontList = accountList.filter(n => n.rpc === activeNetwork.rpc)
        this.SET_ACCOUNTLIST(myAccontList)
      }
      this.SET_SYMBOL(activeNetwork.symbol)
      this.SET_IDS(activeNetwork.ids)
      this.SET_BROWSER(activeNetwork.browser)
      this.SET_NETWORKTYPE(activeNetwork.networkType)
      this.SET_FILECOINADDRESS0(activeNetwork.filecoinAddress0)
      this.SET_DECIMALS(activeNetwork.decimals)
      this.SET_OWENCHAIN(activeNetwork.disabled)
      this.SET_RPCIMAGE(activeNetwork.image)
      this.SET_DERIVEINDEX(activeNetwork.deriveIndex)
    } else {
      const _first = defaultNetworks.length && defaultNetworks[0]
      localStore.set({ activeNetwork: _first })
    }

    const activeAccount = await localStore.get('activeAccount')
    if (activeAccount) {
      this.SET_ACTIVEACCOUNT(activeAccount)
      this.SET_PRIVATEKEY(activeAccount.privateKey)
      this.SET_ADDRESS(activeAccount.address)
      this.SET_ACCOUNTNAME(activeAccount.accountName)
    }
    this.$emit('layoutMounted')
  },
  mounted () {
    const _that = this
    _that.SET_ONLINE(navigator.onLine)
    document.body.ononline = function (e) {
      _that.SET_ONLINE(navigator.onLine)
    }
    document.body.onoffline = function (e) {
      _that.SET_ONLINE(navigator.onLine)
    }
  },
  methods: {
    ...mapMutations('app', [
      'SET_ONLINE',
      'SET_ACTIVENETWORK',
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
