<template>
  <div class="content-page">
    <welcome v-if="accountList.length === 0"/>
    <lockUser v-else-if="lockUser.length"/>
    <layout  v-else @layoutMounted="layoutMounted">
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
    </layout>
    <el-dialog
      :visible.sync="addAccountVisable"
      width="300px"
      :show-close="false"
      class="network-dialog"
      :top="'34vh'"
    >
        <kyAdd
          v-if="addAccountVisable"
          :addName.sync="addName"
          @confirmAdd="confirmAdd"
          @closeAdd="closeAdd"
        />
    </el-dialog>
    <div class="loading" v-if="isFetch">
      <img :src="loading" alt="" class="img">
    </div>
  </div>
</template>

<script>
import welcome from '@/pages/welcome/component/index.vue'
import lockUser from '@/pages/lock-user/component/index.vue'
import layout from '@/components/layout'
import stepOne from './step-1.vue'
import stepTwo from './step-2.vue'
import kyAdd from '@/pages/account/component/add.vue'
import { mapMutations, mapState } from 'vuex'
import { Database } from '@/utils/database.js'
import { getF1ByMne, getGlobalKek } from '@/utils'
import { AESDecrypt } from '@/utils/key'
export default {
  data () {
    return {
      isFetch: false,
      loading: require('@/assets/image/loading.png'),
      step: 1,
      rpc: '',
      address: '',
      accountList: [],
      lockUser: [],
      db: null,
      origin: '',
      addAccountVisable: false,
      addName: '',
      activeF1: null,
      ethereumF1: null,
      filecoinF1: null,
      calibrationF1: null,
      checkList: [],
      mnemonicWords: ''
    }
  },
  computed: {
    active () {
      return this.address !== ''
    },
    ...mapState('app', [
      'activenNetworks',
      'deriveIndex',
      'networks'
    ])
  },
  components: {
    welcome,
    lockUser,
    layout,
    stepOne,
    stepTwo,
    kyAdd
  },
  async mounted () {
    const origin = window.localStorage.getItem('fiveTokenConnectOrigin')
    this.origin = origin
    const db = new Database()
    this.db = db
    const lockUser = await db.getTable('lockUser', { khazix: 'khazix' })
    this.lockUser = lockUser
    const activenNetworks = await db.getTable('activenNetworks', { khazix: 'khazix' })
    if (activenNetworks.length) {
      const rpc = activenNetworks[0].rpc
      this.rpc = rpc
      const accountList = await db.getTable('accountList', { rpc: rpc, isDelete: 0 })
      this.accountList = accountList
      const walletKey = await db.getTable('walletKey', { khazix: 'khazix' })
      if (walletKey.length) {
        const nme = walletKey[0].mnemonicWords
        this.mnemonicWords = AESDecrypt(nme)
      }
      if (accountList.length) {
        const frist = accountList[0]
        this.address = frist.address
      }
    }
  },
  methods: {
    ...mapMutations('app', ['SET_DERIVEINDEX']),
    async layoutMounted () {

    },
    async addAccount () {
      const _accountList_ = await this.db.getTable('accountList', { rpc: this.rpc })
      this.addName = 'Account' + (_accountList_.length + 1)
      this.addAccountVisable = true
    },
    next (checkList) {
      this.step = 2
      this.checkList = checkList
    },
    closeAdd () {
      this.addAccountVisable = false
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
          origin: this.origin,
          khazix: 'khazix'
        }
      })
      // eslint-disable-next-line no-undef
      const address = account.length && account[0].address
      // eslint-disable-next-line no-undef
      popupToBackground('fil_requestAccounts', { account: [address] })
      this.isFetch = false
      // eslint-disable-next-line no-undef
      popupWindowRemove()
    },
    async confirmAdd () {
      this.isFetch = true
      try {
        setTimeout(async () => {
          const kek = getGlobalKek()
          const deriveIndex = this.deriveIndex
          console.log('deriveIndex:', deriveIndex)
          const ethereumF1 = await getF1ByMne(this.mnemonicWords, kek, 'ethereum', '', deriveIndex)
          const filecoinF1 = await getF1ByMne(this.mnemonicWords, kek, 'proxy', 'f', deriveIndex)
          const calibrationF1 = await getF1ByMne(this.mnemonicWords, kek, 'proxy', 't', deriveIndex)
          const accountName = this.addName
          // eslint-disable-next-line camelcase
          const create_time = parseInt(new Date().getTime() / 1000)
          const _account = []
          const _networks = []
          for (const n of this.networks) {
            if (n.filecoinAddress0 === 'f') {
              _account.push({
                accountName,
                address: filecoinF1.address,
                createType: 'mnemonic',
                privateKey: filecoinF1.privateKey,
                create_time,
                khazix: 'khazix',
                digest: filecoinF1.digest,
                fil: 0,
                isDelete: 0,
                rpc: n.rpc
              })
            } else if (n.filecoinAddress0 === 't') {
              _account.push({
                accountName,
                address: calibrationF1.address,
                createType: 'mnemonic',
                privateKey: calibrationF1.privateKey,
                create_time,
                khazix: 'khazix',
                digest: calibrationF1.digest,
                fil: 0,
                isDelete: 0,
                rpc: n.rpc
              })
            } else {
              _account.push({
                accountName,
                address: ethereumF1.address,
                createType: 'mnemonic',
                privateKey: ethereumF1.privateKey,
                create_time,
                khazix: 'khazix',
                digest: ethereumF1.digest,
                fil: 0,
                isDelete: 0,
                rpc: n.rpc
              })
            }
            _networks.push({
              ...n,
              deriveIndex: n.deriveIndex + 1
            })
          }
          await this.db.bulkAddTable('accountList', _account)
          await this.db.bulkPutTable('networks', _networks)
          this.SET_DERIVEINDEX(this.deriveIndex + 1)
          await this.db.modifyTable(
            'activenNetworks',
            { rpc: this.rpc },
            { deriveIndex: this.deriveIndex + 1 }
          )
          const accountList = await this.db.getTable('accountList', { rpc: this.rpc, isDelete: 0 })
          this.accountList = accountList
          this.isFetch = false
          this.addAccountVisable = false
        }, 0)
      } catch (error) {
        this.isFetch = false
        this.addAccountVisable = false
        console.log(error, 'error')
      }
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
