<template>
  <div class="filecoinwallet-page">
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
export default {
    data(){
      return{ 
        accountList:[],
        lock:false
      }
    },
    components:{
        welcome,
        wallet,
        lock
    },
    async beforeCreate(){
      let activenNetworks = await window.filecoinwalletDb.activenNetworks.where({ khazix:'khazix'}).toArray ();
      let rpc = activenNetworks.length && activenNetworks[0].rpc
      let lockUser = await window.filecoinwalletDb.lockUser.where({ khazix:'khazix'}).toArray ();
      if(lockUser.length){
        this.lock = true
      }
      let accountList = await window.filecoinwalletDb.accountList.where({ rpc:rpc}).toArray ();
      this.accountList = accountList || []
    },
}
</script>
<style lang="less" scoped>
.filecoinwallet-page{
  height: 100%;
  .wallet-wce-wrap{
    height: 100%;
  }
}

</style>
