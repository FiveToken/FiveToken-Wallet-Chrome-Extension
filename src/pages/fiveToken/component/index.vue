<template>
  <div class="fivetoken-page">
    <div class="lock" v-if="lock">
      <lock />
    </div>
    <div class="wallet-wce-wrap" v-else>
      <wallet v-if="accountList.length"/>
      <welcome   v-else/>
    </div>
  </div>
</template>

<script>
import welcome from '@/pages/welcome/component/index.vue'
import wallet from '@/pages/wallet/component/index.vue'
import lock from '@/pages/lock-user/component/index.vue'
import ExtensionStore from '@/utils/local-store'
export default {
  data () {
    return {
      accountList: [],
      lock: false,
      localStore: null
    }
  },
  components: {
    welcome,
    wallet,
    lock
  },
  async beforeCreate () {
    const localStore = new ExtensionStore()
    const allStore = await localStore.get(null)
    console.log(allStore, 'allStoreallStoreallStore')
    const activeNetwork = await localStore.get('activeNetwork')
    if (activeNetwork) {
      const rpc = activeNetwork.rpc
      const lockUser = await localStore.get('lockUser')
      if (lockUser) {
        this.lock = true
      }
      const accountList = await localStore.get('accountList')
      if (accountList) {
        const myAccountList = accountList.filter((n) => n.rpc === rpc)
        this.accountList = myAccountList || []
      }
    }
  },
  async mounted () {
    const localStore = new ExtensionStore()
    this.localStore = localStore
    window.onunload = function () {
      const time = new Date().getTime()
      localStorage.setItem('time', time.toString())
      localStorage.setItem('onunload', time.toString())
    }
    await this.eventListener()
  },
  beforeDestroy () {
    this.updateTime()
  },
  methods: {
    updateTime () {
      const time = new Date().getTime()
      localStorage.setItem('time', time.toString())
    },
    async eventListener () {
      const lastTime = localStorage.getItem('time')
      const time = new Date().getTime()
      const activeAccount = await this.localStore.get('activeAccount')
      const { address, privateKey } = activeAccount
      if (lastTime !== null && time - Number(lastTime) > 300 * 1000) {
        await this.localStore.set({
          lockUser: {
            address,
            privateKey
          }
        })
      }
      localStorage.setItem('time', time.toString())
    }
  }
}
</script>
<style lang="less" scoped>
.fivetoken-page{
  height: 100%;
  .wallet-wce-wrap{
    height: 100%;
  }
}
</style>
