<template>
    <div class="step-two">
        <div class="logo">
          <img class="img" :src="logo" />
        </div>
        <div class="www">{{origin}}</div>
        <div class="title">
            {{$t("fiveTokenContent.linkto") }}
            <div class="accounts" v-if="checkList.length > 1">accounts</div>
            <div class="account" v-if="checkList.length === 1">
                {{checkedAccount[0].accountName}}
            （{{checkedAccount[0].address|formatAddress}}）
            </div>
        </div>
        <div class="allow">{{$t('fiveTokenContent.allown')}}：</div>
        <div class="agree">
          <div class="checkbox">
            <i class="el-icon-check"></i>
          </div>
          <div class="label">
            {{$t('fiveTokenContent.rights')}}
          </div>
        </div>
        <div class="btn-wrap">
          <kyButton @btnClick="cancel">{{$t('fiveTokenContent.cancel')}}</kyButton>
          <kyButton type="primary" :active='active' @btnClick="connect">{{$t('fiveTokenContent.connect')}}</kyButton>
        </div>
      </div>
</template>

<script>
import kyButton from '@/components/button'

export default {
  data () {
    return {
      logo: require('@/assets/image/logo.png'),
      active: true
    }
  },
  props: {
    origin: String,
    accountList: Array,
    checkList: Array
  },
  computed: {
    checkedAccount () {
      const list = this.accountList.filter(n => {
        return this.checkList.includes(n.address)
      })
      return list
    }
  },
  components: {
    kyButton
  },
  filters: {
    formatAddress (address) {
      if (address.length > 12) {
        const str =
          address.substr(0, 6) + '...' + address.substr(address.length - 6, 6)
        return str
      } else {
        return address
      }
    }
  },
  methods: {
    cancel () {
      this.$emit('update:step', 1)
    },
    async connect () {
      this.$emit('connect')
    }
  }
}
</script>
<style lang="less" scoped>
.step-two {
    height: 550px;
    position: relative;
    .logo{
        width: 80px;
        height: 80px;
        margin: 0 auto;
        padding:50px 0 10px;
        .img{
        width:80px;
        height: 80px;
        }
    }
    .www{
        font-size: 14px;
        color: #222;
        text-align: center;
        margin-bottom: 20px;
    }
    .title{
        font-size: 16px;
        color: #222;
        font-weight: bolder;
        margin-bottom: 10px;
        text-align: center;
    }
    .allow{
        font-size: 14px;
        color: #666;
        margin-bottom: 10px;
        text-align: center;
    }
    .agree{
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
        .checkbox{
            width: 18px;
            height: 18px;
            border:1px solid #666;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.3;
        }
        .label{
            padding-left: 10px;
        }
    }
    .btn-wrap{
        position: absolute;
        left: 0;
        bottom: 20px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        /deep/.button-wrap{
            width: 155px;
        }
    }
}
</style>
