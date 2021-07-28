<template>
  <div class="welcome-page">
    <div class="logo-wrap">
      <img class="img" :src="logo" />
    </div>
    <div class="title">{{$t('welcome.title')}}</div>
    <div class="sub-title">{{$t('welcome.subTitle1')}}{{$t('welcome.subTitle2')}}</div>
    <!-- <div class="sub-title">{{$t('welcome.subTitle2')}}</div> -->
    <div class="btn-wrap">
      <el-button type="primary" @click="welcome">
        {{$t('welcome.btn')}}
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
    data(){
      return{ 
        logo:require('@/assets/image/logo.png'),
        bls:null
      }
    },
    mounted(){
      
    },
    methods: {
      toDocs(){
            openUrl(`https://docs.filecoinwallet.com/`)
        },
      welcome(){
        window.location.href = './first-wallet.html'
      }
    }
}
</script>
<style lang="less" scoped>
.welcome-page{
  width: 100%;
  margin: 0 auto;
  min-height: 100%;
  background: #fff;
  padding: 80px 20px 0;
  box-sizing: border-box;

    .help{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 20px 10px;
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
    width: 120px;
    height: 120px;
    margin:  0 auto 60px;
    .img{
      width: 120px;
      height: 120px;
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
    padding-top: 50px;
    /deep/.el-button{
      a{
         color: #fff;
        font-size: 14px;
        text-decoration: none;
      }
    }
  }
}

</style>
