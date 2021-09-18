<template>
  <layout>
    <div class="lock-page">
      <div class="logo">
        <img class="img" :src="logo" />
      </div>
      <div class="title">{{$t('lock.title')}}</div>
      <div class="sub-title">{{$t('lock.subTitle')}}</div>
      <div class="input-item">
        <div class="label">{{$t('lock.label')}}</div>
        <kyInput
          :value="password"
          :type="passwordType"
          @changeInput="passwordChange"
          @changeEye="changeEye"
          :suffix="suffix"
          @keyup.enter.native="unlocking"
        > </kyInput>
      </div>
      <div class="btn-wrap">
        <kyButton type="primary" :active='active' @btnClick="unlocking">{{$t('lock.unlocking')}}</kyButton>
      </div>
    </div>
  </layout>
</template>

<script>
import { validatePassword } from '@/utils'
import layout from '@/components/layout'
import kyInput from '@/components/input'
import kyButton from '@/components/button'
import { Database } from '@/utils/database.js'
export default {
  data () {
    return {
      logo: require('@/assets/image/logo.png'),
      suffix: true,
      password: '',
      passwordType: 'password',
      salt: null,
      db: null
    }
  },
  computed: {
    active () {
      return this.password !== ''
    }
  },
  components: {
    layout,
    kyInput,
    kyButton
  },
  async mounted () {
    const db = new Database()
    this.db = db
    const walletKey = await db.getTable('walletKey', { khazix: 'khazix' })
    if (walletKey.length) {
      this.salt = walletKey[0].salt
    }
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
      if (this.salt) {
        const voild = await validatePassword(this.password, this.salt)
        if (voild) {
          await this.db.deleteTable('lockUser', { khazix: 'khazix' })
          window.location.href = './wallet.html'
        } else {
          this.$message.error(this.$t('lock.passwordError'))
        }
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
}
</style>
