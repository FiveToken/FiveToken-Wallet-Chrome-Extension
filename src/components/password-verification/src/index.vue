<template>
  <div class="password-verification">
    <div class="title">{{ $t("passwordVerification.title") }}</div>
    <div class="close" @click="close">
      <i class="el-icon-close"></i>
    </div>
    <div class="content">
      <div class="input-item">
        <div class="label">{{ $t("passwordVerification.label") }}</div>
        <base-input
          :value="password"
          :type="passwordType"
          :suffix="suffix"
          @changeInput="changeInput"
           @changeEye="passwordEye"
        >
        </base-input>
      </div>
      <div class="btn-wrap">
        <base-button @btnClick="close">
          {{ $t("passwordVerification.cancel") }}
        </base-button>
        <base-button
          @btnClick="confirm"
          :type="'primary'"
          :active="active"
        >
          {{ $t("passwordVerification.confirm") }}
        </base-button>
      </div>
    </div>
  </div>
</template>
<script>
import baseInput from '@/components/input'
import baseButton from '@/components/button'
import { decryptByPrivateKey } from '@/utils/encrypt'
import { mapState } from 'vuex'
export default {
  name: 'PasswordVerification',
  components: {
    baseInput,
    baseButton
  },
  data () {
    return {
      password: '',
      passwordType: 'password',
      suffix: true
    }
  },
  computed: {
    active () {
      return this.password !== ''
    },
    ...mapState('app', [
      'privateKey',
      'address'
    ])
  },
  methods: {
    changeInput (value) {
      this.password = value
    },
    close () {
      this.$emit('close')
    },
    passwordEye (eye) {
      this.passwordType = eye ? 'text' : 'password'
    },
    async confirm () {
      const password = await decryptByPrivateKey(this.privateKey, this.password, this.address)
      if (password) {
        this.$emit('confirm', this.password)
      } else {
        this.$message.error(this.$t('settingBackups.passwordError'))
      }
    }
  }
}
</script>
<style lang="less" scoped>
.password-verification{
    .title{
        height: 43px;
        line-height: 43px;
        font-size: 14px;
        color: #101010;
        border-bottom:1px solid #F5F5F5;
        text-align: center;
    }
    .close{
        width: 20px;
        height: 20px;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
        i{
            color: #201F1F;
        }
    }
    .content{
        padding: 10px 20px 20px;
        .input-item{
            margin-bottom: 30px;
            .label{
                font-size: 12px;
                color: #131313;
                margin-bottom: 5px;
            }
        }
        .btn-wrap{
            display: flex;
            justify-content: space-between;
            align-items: center;
            /deep/.button-wrap{
                width: 105px;
            }
        }
    }
}
</style>
