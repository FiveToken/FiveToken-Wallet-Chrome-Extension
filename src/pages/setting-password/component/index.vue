<template>
  <ky-layout @layoutMounted="layoutMounted">
    <div class="setting-password">
      <div class="back-wrap">
        <ky-back :name="$t('settingPassword.title')"  @pageBack="back" />
      </div>
      <div class="setting-password-content">
          <div class="input-item">
            <div class="label">{{$t('settingPassword.currentPassword')}}</div>
            <ky-input
                :value="form.currentPassword"
                maxlength='15'
                :suffix="suffix"
                :error="currentError"
                :type="currentType"
                @changeInput="nameChange"
                @changeEye="currentEye"
            ></ky-input>
            <div class="error" v-if="currentError">{{$t('creatWallet.passwordError')}}</div>
          </div>
          <div class="input-item">
            <div class="label">{{$t('settingPassword.newPassword')}}</div>
            <ky-input
                :value="form.password"
                :error="passwordError"
                :suffix="suffix"
                :type="passwordType"
                maxlength='20'
                @changeInput="passwordChange"
                @changeEye="passwordEye"
            ></ky-input>
            <div class="error" v-if="passwordError">
              {{diff ? $t('creatWallet.diffError'):$t('creatWallet.passwordError')}}
            </div>
            <ky-progress :value="passwordLevel"></ky-progress>
            <div>{{$t('creatWallet.passwordStrength')}}</div>
          </div>
          <div class="input-item">
            <div class="label">{{$t('settingPassword.confirmPassword')}}</div>
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
          </div>
          <div class="btn-wrap">
            <ky-button :type="'primary'" :active="!disabled" @btnClick="create">{{$t('settingPassword.confirm')}}</ky-button>
          </div>
        </div>
    </div>
  </ky-layout>
</template>

<script>
import { decryptByPrivateKey } from '@/utils/encrypt'
import { encrypt, encryptMessage } from '@/utils/aes-gcm'
import { isValidPass, routePush, zxcvbnFun } from '@/utils'
import ExtensionStore from '@/utils/local-store'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      suffix: true,
      currentError: false,
      currentType: 'password',
      passwordType: 'password',
      passwordError: false,
      confirmType: 'password',
      confirmError: false,
      form: {
        currentPassword: '',
        password: '',
        confirmPassword: ''
      },
      passwordLevel: 0,
      localStore: null
    }
  },
  computed: {
    ...mapState('app', [
      'activeAccount',
      'accountList'
    ]),
    disabled () {
      const values = Object.values(this.form)
      const bol = values.every(n => {
        return n !== ''
      })
      return !bol
    }
  },
  mounted () {
    this.localStore = new ExtensionStore()
  },
  methods: {
    async layoutMounted () {
    },
    currentEye (eye) {
      this.currentType = eye ? 'text' : 'password'
    },
    confirmEye (eye) {
      this.confirmType = eye ? 'text' : 'password'
    },
    passwordEye (eye) {
      this.passwordType = eye ? 'text' : 'password'
    },
    nameChange (val) {
      this.form.currentPassword = val
    },
    passwordChange (val) {
      this.passwordLevel = zxcvbnFun(val)
      this.form.password = val
    },
    confirmChange (val) {
      this.form.confirmPassword = val
    },
    reset () {
      this.currentError = false
      this.passwordError = false
      this.confirmError = false
      this.diff = false
    },
    async isCheck () {
      const { currentPassword, password, confirmPassword } = this.form
      if (!isValidPass(currentPassword)) {
        this.currentError = true
        return false
      } else {
        this.currentError = false
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
        this.passwordError = true
        this.confirmError = true
        this.currentError = true
        return false
      } else {
        this.passwordError = false
        this.confirmError = false
        this.diff = false
      }
      return true
    },
    async create () {
      if (!this.disabled) {
        this.reset()
        const bool = await this.isCheck()
        if (bool) {
          const { currentPassword, password } = this.form
          const activeAccount = this.activeAccount
          const accountList = this.accountList
          const { address, privateKey } = activeAccount
          const publicKey = await decryptByPrivateKey(privateKey, currentPassword, address)
          const activeListNew = []
          let activeAccountNew = null
          if (publicKey !== null) {
            const senderPublicKey = await encrypt(password, address)
            const encryptedPrivateKey = await encryptMessage(password, senderPublicKey, address)
            accountList.map(async item => {
              const { address } = item
              const encrypted = await encryptMessage(password, senderPublicKey, address)
              const { accountName, createType, fil, id, rpc } = item
              activeListNew.push({
                accountName,
                createType,
                fil,
                id,
                rpc,
                address: item.address,
                privateKey: encrypted
              })
            })

            activeAccountNew = {
              ...activeAccount,
              privateKey: encryptedPrivateKey
            }
            await this.localStore.set({ accountList: activeListNew })
            await this.localStore.set({ activeAccount: activeAccountNew })
            routePush('./setting.html')
            return true
          } else {
            this.$message.error(this.$t('lock.passwordError'))
            return false
          }
        }
      }
    },
    createWallet () {
      window.location.href = './create-wallet.html?createType=create'
    },
    importWallet () {
      window.location.href = './create-wallet.html?createType=importWords'
    },
    back () {
      window.location.href = './setting.html'
    }
  }
}
</script>
<style lang="less" scoped>
.setting-password{
  width: 100%;
  margin: 0 auto;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  .back-wrap{
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
  }
  .setting-password-content{
    padding: 20px;
  }
  .title{
    color: #222;
    font-size: 18px;
    font-weight: bolder;
    padding: 25px 0;
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
