<template>
  <div class="content-page">
    <welcome v-if="accountList.length === 0"/>
    <lockUser v-else-if="lock"/>
    <ky-layout  v-else @layoutMounted="layoutMounted">
      <stepOne
        :accountList="accountList"
        :origin="origin"
        v-if="step === 1"
        @next="next"
        @addAccount="addAccount"
      />
      <stepTwo
        :origin="origin"
        :step.sync="step"
        :accountList="accountList"
        :checkList="checkList"
        @connect="connect"
        v-if="step === 2"
      />
    </ky-layout>
    <div class="loading" v-if="isFetch">
      <img :src="loading" alt="" class="img">
    </div>
  </div>
</template>

<script>
import welcome from '@/pages/welcome/component/index.vue'
import lockUser from '@/pages/lock-user/component/index.vue'
import stepOne from './step-1.vue'
import stepTwo from './step-2.vue'
import { mapMutations, mapState } from 'vuex'
import ExtensionStore from '@/utils/local-store'
import { popupToBackground, popupWindowRemove } from '@/popup.js'
export default {
  components: {
    welcome,
    lockUser,
    stepOne,
    stepTwo
  },
  data () {
    return {
      isFetch: false,
      loading: require('@/assets/image/loading.png'),
      step: 1,
      rpc: '',
      address: '',
      accountList: [],
      lock: [],
      localStore: null,
      origin: '',
      checkList: []
    }
  },
  computed: {
    active () {
      return this.address !== ''
    },
    ...mapState('app', [
      'activeNetwork',
      'deriveIndex',
      'networks'
    ])
  },
  async mounted () {
    const origin = window.localStorage.getItem('fiveTokenConnectOrigin')
    this.origin = origin
    const localStore = new ExtensionStore()
    this.localStore = localStore
    const lockUser = await localStore.get('lockUser')
    if (lockUser) {
      this.lock = true
    }

    const activeNetwork = await localStore.get('activeNetwork')
    if (activeNetwork) {
      this.rpc = activeNetwork.rpc
      const accountList = await localStore.get('accountList')
      if (accountList) {
        const _accountList = accountList.filter(n => n.rpc === activeNetwork.rpc)
        this.accountList = _accountList
        if (_accountList.length) {
          const frist = _accountList[0]
          this.address = frist.address
        }
      }
    }
  },
  methods: {
    ...mapMutations('app', ['SET_DERIVEINDEX']),
    async layoutMounted () {

    },
    async addAccount () {
      window.location.href = './add-account.html'
    },
    next (checkList) {
      this.step = 2
      this.checkList = checkList
    },
    cancel () {
      // eslint-disable-next-line no-undef
      popupWindowRemove()
    },
    async connect () {
      this.isFetch = true
      const list = this.accountList.filter(n => {
        return this.checkList.includes(n.address)
      })
      const account = list.map((n, index) => {
        return {
          address: n.address,
          rpc: n.rpc,
          accountName: n.accountName,
          createType: n.createType,
          fil: n.fil,
          origin: this.origin
        }
      })
      // eslint-disable-next-line no-undef
      const address = account.length && account[0].address
      // eslint-disable-next-line no-undef
      popupToBackground('fil_requestAccounts', { account: [address] })
      this.isFetch = false
      // eslint-disable-next-line no-undef
      popupWindowRemove()
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-dialog{
    border-radius: 10px;
    .el-dialog__header{
        padding: 0;
    }
    .el-dialog__body{
        padding: 0;
    }
}
.content-page{
  width: 100%;
  height: 100%;
  padding:0 20px;
  box-sizing: border-box;
  position: relative;
  .loading{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    .img{
        animation:turnX 3s linear infinite;
    }
    @keyframes turnX{
        0%{
            transform:rotateZ(0deg);
        }
        100%{
            transform:rotateZ(360deg);
        }
    }
  }
}
</style>
