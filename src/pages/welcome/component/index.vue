<template>
  <ky-layout>
    <div class="welcome-page">
      <div class="logo-wrap">
        <img class="img" :src="logo" />
      </div>
      <div class="title">{{$t('welcome.title')}}</div>
      <div class="sub-title">{{$t('welcome.subTitle1')}}{{$t('welcome.subTitle2')}}</div>
      <!-- <div class="sub-title">{{$t('welcome.subTitle2')}}</div> -->
      <div class="btn-wrap">
        <ky-button :type="'primary'" :active="active" style="margin-bottom:20px" @btnClick="createWallet">
          {{$t('welcome.btn1')}}
        </ky-button>
        <ky-button @btnClick="importWallet">{{$t('welcome.btn2')}}</ky-button>
      </div>
    </div>
  </ky-layout>
</template>

<script>
export default {
  data () {
    return {
      logo: require('@/assets/image/logo.png'),
      active: true,
      bls: null
    }
  },
  methods: {
    createWallet () {
      window.location.href = './create-wallet.html?createType=create'
    },
    importWallet () {
      window.location.href = './create-wallet.html?createType=importWords&sourceType=import'
    }
  }
}
</script>
<style lang="less" scoped>
.welcome-page{
  width: 100%;
  margin: 0 auto;
  height: 100%;
  background: #fff;
  padding: 50px 20px 0;
  box-sizing: border-box;
  .help{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 20px 10px 20px;
    .text{
      color: #222;
      font-size: 14px;
      margin-right: 8px;
    }
    .link{
      font-size: 14px;
      color:#5CC1CB;
    }
  }
  .logo-wrap{
    width: 64px;
    height: 63px;
    margin:  0 auto 30px;
    .img{
      width: 64px;
      height: 63px;
    }
  }
  .title{
    text-align: center;
    color: #222;
    font-size: 28px;
    font-weight: bolder;
    margin-bottom: 30px;
  }
  .sub-title{
    text-align: center;
    color: #222;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .btn-wrap{
    text-align: center;
    padding-top: 120px;
  }
}

</style>
