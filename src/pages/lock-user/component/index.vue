<template>
  <div class="lock-page">
    <div class="logo">
      <img class="img" :src="logo" />
    </div>
    <div class="title">{{$t('lock.welcomeBack')}}</div>
    <div class="sub-title">{{$t('lock.enterNetwork')}}</div>
    <!-- <div class="select-address" v-if="accountList.length">
      <el-radio-group v-model="address" @change="radioClick">
        <el-radio :label="item.address" v-for="(item,index) in accountList" :key="index">{{item.accountName}}</el-radio>
      </el-radio-group>
    </div> -->
    <div class="select-address">
      <div class="label">{{$t('lock.selectAccount')}}</div>
      <el-select v-model="address" @change="radioClick">
        <el-option
          v-for="item in accountList"
          :key="item.value"
          :label="formatLabel(item.accountName,item.address)"
          :value="item.address">
        </el-option>
      </el-select>
    </div>
    
    <div class="input-item">
      <div class="label">{{$t('lock.inputPassword')}}</div>
      <el-input v-model="password" type="password"> </el-input>
    </div>
    <div class="btn-wrap">
      <el-button type="primary" :disabled='disabled' @click="unlocking">{{$t('lock.unlocking')}}</el-button>
    </div>
  </div>
</template>

<script>
import { validatePrivateKey} from '@/utils/key'
export default {
    data(){
      return{ 
        logo:require('@/assets/image/logo.png'),
        password:'',
        address:'',
        accountList:[],
        encodePrivateKey:'',
        digest:'',
        lockUserItem:null
      }
    },
    computed:{
      disabled(){
        return !(this.password !== '' && this.address !== '')
      }
    },
    async mounted(){
      let lockUser = await window.filecoinwalletDb.lockUser.where({ kunyao:'kunyao'}).toArray();
      if(lockUser.length){
        let first = lockUser[0]
        this.address = first.address
        this.encodePrivateKey = first.privateKey
        this.digest = first.digest
      }
      this.accountList  = await window.filecoinwalletDb.accountList.where({ kunyao:'kunyao'}).toArray();
      let unLockUser = this.accountList.find(n=>{
          return n.address === this.address
      })
      this.lockUserItem = unLockUser
    },
    methods:{
      formatLabel(accountName,address){
        if(address.length>12){
            let str = address.substr(0,6) + '...' + address.substr(address.length-6,6)
            return `${accountName} ( ${str} )`
        }else{
            return `${accountName} ( ${address} )`
        } 
      },
      radioClick(){
        let unLockUser = this.accountList.find(n=>{
          return n.address === this.address
        })
        this.encodePrivateKey = unLockUser.privateKey
        this.digest = unLockUser.digest
        this.lockUserItem = unLockUser
      },
      async unlocking(){
        // verification password
        let voild = await validatePrivateKey(this.address,this.password,this.encodePrivateKey,this.digest)
        if(voild){
          let {address,accountName,privateKey,create_time,digest,mnemonicWords,fil} = this.lockUserItem
          await window.filecoinwalletDb.activeAccount.where({ kunyao:'kunyao'}).delete();
          await window.filecoinwalletDb.activeAccount.add({
              address,
              accountName,
              privateKey,
              create_time,
              kunyao:'kunyao',
              fil,
              mnemonicWords,
              digest
          })
          window.location.href = './wallet.html'
          await window.filecoinwalletDb.lockUser.where({ kunyao:'kunyao'}).delete();
        }else{
          this.$message.error(this.$t('lock.passwordError')) 
        }
      }
    }
}
</script>
<style lang="less" scoped>
.lock-page{
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
  .title{
    font-size: 24px;
    color: #222;
    font-weight: bolder;
    margin-bottom: 5px;
    text-align: center;
  }
  .sub-title{
    font-size: 14px;
    padding: 0 20px;
    color: #222;
    text-align: center;
    padding: 0 20px;
    margin-bottom: 20px;
  }
  .select-address{
    margin-bottom: 20px;
    .label{
      font-size: 14px;
      color: #222;
      margin-bottom: 10px;
    }
    /deep/.el-select{
      width: 100%;
    }
  }
  .input-item{
    .label{
      font-size: 14px;
      color: #222;
      margin-bottom: 10px;
    }
    margin-bottom: 20px;
  }
  .btn-wrap{
    display: flex;
    /deep/.el-button{
      flex-grow: 1;
    }
  }
}
</style>
