<template>
  <ky-layout>
    <div class="lock-page">
      <div class="logo">
        <img class="img" :src="logo" />
      </div>
      <div class="title">{{$t('lock.title')}}</div>
      <div class="sub-title">{{$t('lock.subTitle')}}</div>
      <div class="input-item">
        <div class="label">{{$t('lock.label')}}</div>
        <ky-input
          :value="password"
          :type="passwordType"
          @changeInput="passwordChange"
          @changeEye="changeEye"
          :suffix="suffix"
          @keyup.enter.native="unlocking"
        > </ky-input>
      </div>
      <div class="btn-wrap">
        <ky-button type="primary" :active='active' @btnClick="unlocking">{{$t('lock.unlocking')}}</ky-button>
      </div>
      <div class="btn-bottom">
        {{$t('lock.bottomLabel')}} <a href="./create-wallet.html?createType=importWords&sourceType=recovery">{{$t('lock.bottomLabel2')}}</a> {{$t('lock.bottomLabel3')}}
      </div>
    </div>
  </ky-layout>
</template>

<script>
import ExtensionStore from '@/utils/local-store'
import { decryptByPrivateKey } from '@/utils/encrypt'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      logo: require('@/assets/image/logo.png'),
      suffix: true,
      password: '',
      passwordType: 'password',
      localStore: null
    }
  },
  computed: {
    ...mapState('app', ['privateKey', 'address']),
    active () {
      return this.password !== ''
    }
  },
  async mounted () {
    const localStore = new ExtensionStore()
    this.localStore = localStore
  },
  methods: {
    passwordChange (val) {
      this.password = val
    },
    changeEye (val) {
      this.passwordType = val ? 'text' : 'password'
    },
    async unlocking () {
      if (!this.password) {
        return
      }
      const voild = await decryptByPrivateKey(this.privateKey, this.password, this.address)
      if (voild) {
        await this.localStore.remove('lockUser')
        const nextPage = window.localStorage.getItem('nextPage')
        if (nextPage === 'fiveToken-connect') {
          window.localStorage.removeItem('nextPage')
          window.location.href = './fiveToken-connect.html'
        } else {
          window.location.href = './wallet.html'
        }
      } else {
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
    width: 64px;
    height: 64px;
    margin: 0 auto;
    padding:100px 0 30px;
    .img{
      width:64px;
      height: 64px;
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
    color: #222;
    text-align: left;
    margin-bottom: 50px;
  }
  .input-item{
    .label{
      font-size: 14px;
      color: #222;
      margin-bottom: 10px;
    }
    margin-bottom: 40px;
  }
  .btn-wrap{
    display: flex;
  }
  .btn-bottom{
    font-size: 14px;
    color: #222;
    margin: 10px 0 20px 0;
    a{
      color: #1895A2;
      cursor: pointer;
    }
  }
}
</style>
