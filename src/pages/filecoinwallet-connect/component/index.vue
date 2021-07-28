<template>
  <div class="content-page">
    <welcome v-if="accountList.length === 0"/>
    <lockUser v-else-if="lockUser.length"/>
    <div class="content-wrap" v-else>
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
        <el-button @click="cancel">{{$t('connect.cancel')}}</el-button>
        <el-button type="primary" :disabled='disabled' @click="connect">{{$t('connect.connect')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { validatePrivateKey} from '@/utils/key'
import welcome from '@/pages/welcome/component/index.vue'
import lockUser from '@/pages/lock-user/component/index.vue'
export default {
    data(){
      return{
        address:'',
        accountList:[],
        lockUser:[],
        connectAccount:null,
        logo:require('@/assets/image/logo.png'),
        vv:1
      }
    },
    computed:{
      disabled(){
        return this.address === ''
      }
    },
    components:{
      welcome,
      lockUser
    },
    filters:{
      formatAddress(address){
        if(address.length>12){
            let str = address.substr(0,6) + '...' + address.substr(address.length-6,6)
            return str
        }else{
            return address
        } 
      },
    },
    async mounted(){
        this.lockUser = await window.filecoinwalletDb.lockUser.where({ kunyao:'kunyao'}).toArray();
        let accountList = await window.filecoinwalletDb.accountList.where({ kunyao:'kunyao'}).toArray();
        this.accountList = accountList
        if(accountList.length){
          let frist = accountList[0]
          this.address = frist.address
          this.connectAccount = {
            address:frist.address,
            fil:frist.fil,
            accountName:frist.accountName
          }
        }
        let origin = popupGetVal()
        this.origin = origin
    },
    methods:{
      createAccount(){
        window.location.href = './first-wallet.html'
      },
      radioClick(){
        this.connectAccount = this.accountList.find(n=>{
          return n.address === this.address
        })
        console.log(this.connectAccount,'connectAccount')
      },
      cancel(){
        popupWindowRemove()
      },
      connect(){
        let { address,fil,accountName } = this.connectAccount
        let obj = { address }
        popupToBackground('filecoinWalletConnect', obj)
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
    /deep/.el-button{
      flex-grow: 1;
    }
  }
}
</style>
