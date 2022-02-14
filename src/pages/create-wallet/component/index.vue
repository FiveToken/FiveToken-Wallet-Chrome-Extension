<template>
    <ky-layout @layoutMounted="layoutMounted">
        <div class="create-wallet">
            <ky-back @pageBack="back" />
            <div class="title">
                {{ createType === 'create' ? $t('creatWallet.title') : sourceType === 'recovery'? $t('creatWallet.recoveryWords') : $t('creatWallet.importWords') }}
            </div>
            <div class="input-item">
                <div class="label">{{$t('creatWallet.accountName')}}</div>
                <ky-input
                    :value="form.accountName"
                    maxlength='15'
                    :error="nameError"
                    type="text"
                    @changeInput="nameChange"
                ></ky-input>
                <div class="error" v-if="nameError">{{$t('creatWallet.nameError')}}</div>
                <div class="tips" v-else>{{$t('creatWallet.nameTips')}}</div>
            </div>

            <div class="input-item">
                <div class="label">{{$t('creatWallet.password')}}</div>
                <ky-input
                    :value="form.password"
                    :error="passwordError"
                    maxlength='20'
                    :suffix="suffix"
                    :type="passwordType"
                    @changeInput="passwordChange"
                    @changeEye="passwordEye"
                ></ky-input>
                <div class="error" v-if="passwordError">
                    {{ $t('creatWallet.passwordError')}}
                </div>
               <ky-progress :value="passwordLevel"></ky-progress>
               <div>{{$t('creatWallet.strengthTips')}}</div>
            </div>

            <div class="input-item">
                <div class="label">{{$t('creatWallet.confirmPassword')}}</div>
                <ky-input
                    :value="form.confirmPassword"
                    :error="confirmError"
                    :suffix="suffix"
                    :type="confirmType"
                    maxlength='20'
                    @changeInput="confirmChange"
                    @changeEye="confirmEye"
                ></ky-input>
                <div class="error" v-if="confirmError">
                    {{diff ? $t('creatWallet.diffError'):$t('creatWallet.passwordError')}}
                </div>
                <div class="error" v-if="levelError">
                  {{$t('creatWallet.strengthTips')}}
                </div>
            </div>
            <div class="btn-wrap">
                <ky-button :type="'primary'" :active="!disabled" @btnClick="create">{{$t('creatWallet.btn')}}</ky-button>
            </div>
        </div>
    </ky-layout>
</template>

<script>
import * as bip39 from 'bip39'
import { getQueryString, zxcvbnFun, isValidPass } from '@/utils'
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
      createType: '',
      sourceType: '',
      passwordLevel: 0,
      levelError: false
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
  mounted () {
    const createType = getQueryString('createType')
    const sourceType = getQueryString('sourceType')
    this.passwordLevel = zxcvbnFun(this.form.password)
    this.createType = createType
    this.sourceType = sourceType
    this.$set(this.form, 'accountName', 'Account1')
  },
  methods: {
    async layoutMounted () {
    },
    nameChange (val) {
      this.form.accountName = val
    },
    passwordChange (val) {
      this.passwordLevel = zxcvbnFun(val)
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
            const url = `./import-words.html?accountName=${accountName}&password=${this.form.password}&createType=${this.createType}&sourceType=${this.sourceType}`
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
      const { password, confirmPassword, accountName } = this.form
      if (accountName.length > 15) {
        this.nameError = true
        return false
      } else {
        this.nameError = false
      }
      if (!isValidPass(password)) {
        this.passwordError = true
        return false
      } else {
        this.passwordError = false
      }

      if (!isValidPass(confirmPassword)) {
        this.confirmError = true
        return false
      } else {
        this.confirmError = false
      }

      if (password !== confirmPassword) {
        this.confirmError = true
        this.diff = true
        return false
      } else {
        this.confirmError = false
        this.diff = false
      }
      if (this.passwordLevel < 4) {
        this.levelError = true
        return false
      } else {
        this.levelError = false
      }
      return true
    },
    genMnemonic () {
      return bip39.generateMnemonic()
    },
    back () {
      // const backPage = getQueryString('backPage')
      window.location.href = this.sourceType === 'recovery' ? './fivetoken.html' : './welcome.html'
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
    .back-wrap{
      padding: 15px 20px;
      border-bottom: 1px solid #eee;
    }
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
        padding-top: 60px;
    }
}
</style>
