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
import { Database } from '@/utils/database.js'
export default {
  data () {
    return {
      accountList: [],
      lock: false
    }
  },
  components: {
    welcome,
    wallet,
    lock
  },
  async beforeCreate () {
    const db = new Database()
    const activenNetworks = await db.getTable('activenNetworks', { khazix: 'khazix' })
    const rpc = activenNetworks.length && activenNetworks[0].rpc
    const lockUser = await db.getTable('lockUser', { khazix: 'khazix' })
    if (lockUser.length) {
      this.lock = true
    }
    const accountList = await db.getTable('accountList', { rpc: rpc, isDelete: 0 })
    this.accountList = accountList || []
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
