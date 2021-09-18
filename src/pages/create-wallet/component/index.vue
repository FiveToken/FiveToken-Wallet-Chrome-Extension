<template>
    <layout @layoutMounted="layoutMounted">
        <div class="create-wallet">
            <kyBack @pageBack="back" />
            <div class="title">
                {{ createType === 'create' ? $t('creatWallet.title') : $t('creatWallet.importWords') }}
            </div>
            <div class="input-item">
                <div class="label">{{$t('creatWallet.accountName')}}</div>
                <kyInput
                    :value="form.accountName"
                    maxlength='15'
                    :error="nameError"
                    type="text"
                    @changeInput="nameChange"
                ></kyInput>
                <div class="error" v-if="nameError">{{$t('creatWallet.nameError')}}</div>
                <div class="tips" v-else>{{$t('creatWallet.nameTips')}}</div>
            </div>

            <div class="input-item">
                <div class="label">{{$t('creatWallet.password')}}</div>
                <kyInput
                    :value="form.password"
                    :error="passwordError"
                    :suffix="suffix"
                    :type="passwordType"
                    @changeInput="passwordChange"
                    @changeEye="passwordEye"
                ></kyInput>
                <div class="error" v-if="passwordError">
                    {{diff ? $t('creatWallet.diffError'):$t('creatWallet.passwordError')}}
                </div>
                <div class="tips" v-else>{{$t('creatWallet.passwordTips')}}</div>
            </div>

            <div class="input-item">
                <div class="label">{{$t('creatWallet.confirmPassword')}}</div>
                <kyInput
                    :value="form.confirmPassword"
                    :error="confirmError"
                    :suffix="suffix"
                    :type="confirmType"
                    @changeInput="confirmChange"
                    @changeEye="confirmEye"
                ></kyInput>
                <div class="error" v-if="confirmError">
                    {{diff ? $t('creatWallet.diffError'):$t('creatWallet.passwordError')}}
                </div>
            </div>
            <div class="btn-wrap">
                <kyButton :type="'primary'" :active="!disabled" @btnClick="create">{{$t('creatWallet.btn')}}</kyButton>
            </div>
        </div>
    </layout>
</template>

<script>
import * as bip39 from 'bip39'
import { getQueryString } from '@/utils'
import layout from '@/components/layout'
import kyButton from '@/components/button'
import kyInput from '@/components/input'
import kyBack from '@/components/back'

export default {
  data () {
    return {
      agree: false,
      suffix: true,
      nameError: false,
      passwordType: 'password',
      passwordError: false,
      confirmType: 'password',
      confirmError: false,
      diff: false,
      form: {
        accountName: '',
        password: '',
        confirmPassword: ''
      },
      placeholder: '',
      createType: ''
    }
  },
  computed: {
    disabled () {
      const values = Object.values(this.form)
      const bol = values.every(n => {
        return n !== ''
      })
      return !bol
    }
  },
  components: {
    layout,
    kyInput,
    kyButton,
    kyBack
  },
  mounted () {
    const createType = getQueryString('createType')
    this.createType = createType
    this.$set(this.form, 'accountName', 'Account1')
  },
  methods: {
    async layoutMounted () {
    },
    nameChange (val) {
      this.form.accountName = val
    },
    passwordChange (val) {
      this.form.password = val
    },
    passwordEye (eye) {
      this.passwordType = eye ? 'text' : 'password'
    },
    confirmChange (val) {
      this.form.confirmPassword = val
    },
    confirmEye (eye) {
      this.confirmType = eye ? 'text' : 'password'
    },
    create () {
      if (!this.disabled) {
        this.reset()
        const v = this.check()
        if (v) {
          const trim = this.form.accountName.replace(/(^\s*)|(\s*$)/g, '')
          const accountName = encodeURIComponent(trim)
          if (this.createType === 'create') {
            const mnemonicWords = this.genMnemonic()
            const url = `./create-words.html?accountName=${accountName}&password=${this.form.password}&mnemonicWords=${mnemonicWords}&createType=${this.createType}`
            window.location.href = url
          } else {
            const url = `./import-words.html?accountName=${accountName}&password=${this.form.password}&createType=${this.createType}`
            window.location.href = url
          }
        }
      }
    },
    reset () {
      this.nameError = false
      this.passwordError = false
      this.confirmError = false
      this.diff = false
    },
    check () {
      if (this.form.accountName.length > 15) {
        this.nameError = true
        return false
      } else {
        this.nameError = false
      }

      if (this.form.password.length < 8) {
        this.passwordError = true
        return false
      } else {
        this.passwordError = false
      }

      if (this.form.confirmPassword.length < 8) {
        this.confirmError = true
        return false
      } else {
        this.confirmError = false
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.passwordError = true
        this.confirmError = true
        this.diff = true
        return false
      } else {
        this.passwordError = false
        this.confirmError = false
        this.diff = false
      }
      return true
    },
    genMnemonic () {
      return bip39.generateMnemonic()
    },
    back () {
      // const backPage = getQueryString('backPage')
      window.location.href = './welcome.html'
    }
  }
}
</script>

<style  lang="less" scoped>
.create-wallet{
    width: 100%;
    margin: 0 auto;
    min-height: 100%;
    background: #fff;
    box-sizing: border-box;
    padding: 20px;
    .title{
        color: #222;
        font-size: 18px;
        font-weight: bolder;
        padding: 25px 0;
    }
    .sub-title{
        color: #222;
        font-size: 14px;
        margin-bottom: 30px;
    }
    .input-item{
        margin-bottom: 20px;
        max-width: 320px;
        .label{
            font-size: 14px;
            color: #222;
            margin-bottom: 10px;
        }
        .check-box-wrap{
            padding-top: 10px;
        }
        .tips{
            padding-top:5px;
            font-size: 12px;
            color: #666;
        }
        .error{
            padding-top:5px;
            font-size: 12px;
            color: #EA0F0F;
        }
    }
    /deep/.el-checkbox{
        &.is-checked{
            .el-checkbox__label{
                color: #222;
            }
        }
        .agree-wrap{
            display: flex;
            align-items: center;
            .text{
                margin-right: 5px;
            }
        }
        .clause{
            color: #5CC1CB;
        }
    }
    .btn-wrap{
        padding-top: 80px;
    }
}
</style>
