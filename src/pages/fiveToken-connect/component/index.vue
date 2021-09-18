<template>
  <div class="content-page">
    <welcome v-if="accountList.length === 0"/>
    <lockUser v-else-if="lockUser.length"/>
    <layout  v-else @layoutMounted="layoutMounted">
      <div class="content-wrap">
        <div class="logo">
          <img class="img" :src="logo" />
        </div>
        <div class="www">{{origin}}</div>
        <div class="title">{{$t('connect.title')}}</div>
        <div class="select-address" v-if="accountList.length">
          <el-radio-group v-model="address" @change="radioClick">
            <el-radio :label="item.address" v-for="(item,index) in accountList" :key="index">
              <div class="name">{{item.accountName}}</div>
              <div class="address">{{item.address | formatAddress}}</div>
            </el-radio>
          </el-radio-group>
        </div>
        <div class="btn-wrap" v-if="accountList.length">
          <kyButton @btnClick="cancel">{{$t('connect.cancel')}}</kyButton>
          <kyButton type="primary" :active='active' @btnClick="connect">{{$t('connect.connect')}}</kyButton>
        </div>
      </div>
    </layout>

  </div>
</template>

<script>
import welcome from '@/pages/welcome/component/index.vue'
import lockUser from '@/pages/lock-user/component/index.vue'
import layout from '@/components/layout'
import kyButton from '@/components/button'
import { mapState } from 'vuex'
import { Database } from '@/utils/database.js'
import { popupSendMessage } from '@/pages/popup/index.js'
import { backgroundWindowRemove } from '@/pages/background/index.js'

export default {
  data () {
    return {
      rpc: '',
      address: '',
      accountList: [],
      lockUser: [],
      connectAccount: null,
      logo: require('@/assets/image/logo.png'),
      db: null,
      origin: ''
    }
  },
  computed: {
    active () {
      return this.address !== ''
    },
    ...mapState('app', [
      'activenNetworks'
    ])
  },
  components: {
    welcome,
    lockUser,
    layout,
    kyButton
  },
  filters: {
    formatAddress (address) {
      if (address.length > 12) {
        const str = address.substr(0, 6) + '...' + address.substr(address.length - 6, 6)
        return str
      } else {
        return address
      }
    }
  },
  async mounted () {
    const origin = window.localStorage.getItem('fiveTokenConnect')
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
      if (accountList.length) {
        const frist = accountList[0]
        this.address = frist.address
        this.connectAccount = {
          address: frist.address,
          fil: frist.fil,
          accountName: frist.accountName
        }
      }
    }
  },
  methods: {
    layoutMounted () {

    },
    createAccount () {
      window.location.href = './welcome.html'
    },
    radioClick () {
      this.connectAccount = this.accountList.find(n => {
        return n.address === this.address
      })
      console.log(this.connectAccount, 'connectAccount')
    },
    cancel () {
      backgroundWindowRemove()
    },
    async connect () {
      const { address, fil, accountName, createType } = this.connectAccount
      await this.db.addTable('connectAccount', {
        address,
        rpc: this.rpc,
        accountName,
        createType,
        fil,
        origin: this.origin,
        isActive: 1,
        khazix: 'khazix'
      })
      popupSendMessage('eth_requestAccounts', { accountChanged: true, message: [address] })
      backgroundWindowRemove()
    }
  }
}
</script>
<style lang="less" scoped>
.content-page{
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .logo{
    width: 100px;
    height: 100px;
    margin: 0 auto;
    padding:50px 0 30px;
    .img{
      width:100px;
      height: 100px;
    }
  }
  .www{
    font-size: 14px;
    color: #222;
    text-align: center;
    padding: 0 20px;
    margin-bottom: 20px;
  }
  .title{
    font-size: 24px;
    color: #222;
    font-weight: bolder;
    margin-bottom: 5px;
    text-align: center;
  }
  .sub-title{
    font-size: 14px;
    color: #222;
    text-align: center;
    padding: 0 20px;
    margin-bottom: 20px;
  }
  .new-account{
    font-size: 14px;
    margin-bottom: 20px;
    color: #5CC1CB;
    text-align: right;
    cursor: pointer;
  }
  .select-address{
    margin-bottom: 20px;
    border:1px solid #eee;
    border-radius: 5px;
    padding: 20px;
    height: 160px;
    overflow: auto;
    /deep/.el-radio{
      margin: 0 0 20px 0;
      display: flex;
      align-items: center;
      .el-radio__input.is-checked .el-radio__inner{
        border-color: #5CC1CB;
        background: #5CC1CB;
      }
      .name{
        font-size: 16px;
        color: #222;
        margin-bottom: 5px;
      }
      .address{
        font-size: 12px;
        color: #999;
      }
    }
  }
  .btn-wrap{
    display: flex;
    justify-content: space-between;
    align-items: center;
    /deep/.button-wrap{
      width: 155px;
    }
  }
}
</style>
