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
    async mounted(){
      // determine whether there are locked users
      let lockUser = await window.filecoinwalletDb.lockUser.where({ kunyao:'kunyao'}).toArray ();
      if(lockUser.length){
        this.lock = true
      }
      let accountList = await window.filecoinwalletDb.accountList.where({ kunyao:'kunyao'}).toArray ();
      this.accountList = accountList
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
