<template>
    <ky-layout @layoutMounted="layoutMounted">
        <div class="import-words">
            <ky-back @pageBack="back"></ky-back>
            <div class="title">{{ sourceType === 'recovery'? $t('creatWallet.recoveryWords') : $t('importWords.title')}}</div>
            <div class="sub-title">{{$t('importWords.subTitle')}}</div>
            <div class="input-item" :class="{error}">
                <ky-input
                    :value="form.mnemonicWords"
                    type="textarea"
                    :rows="3"
                    @focus="focus"
                    @changeInput="mnemonicWordsChange"
                >
                </ky-input>
            </div>
            <div class="error-tips" v-if="error">{{ $t('importWords.error') }}</div>
            <div class="tips" v-else>{{ $t('importWords.tips') }}</div>

            <div class="btn-wrap">
                <ky-button
                    :type="'primary'"
                    :active='active'
                    @btnClick="importWallet"
                >
                    {{$t('importWords.btn')}}
                </ky-button>
            </div>
            <div class="loading" v-if="isFetch">
                <img :src="loading" alt="" class="img">
            </div>
        </div>
    </ky-layout>
</template>
<script>
import { getQueryString, trimStr } from '@/utils'
import { encryptCreate } from '@/utils/encrypt'
import { mapMutations, mapState } from 'vuex'
import * as bip39 from 'bip39'
export default {
  data () {
    return {
      loading: require('@/assets/image/loading.png'),
      show: false,
      agree: false,
      isFetch: false,
      form: {
        mnemonicWords: '',
        accountName: '',
        password: ''
      },
      error: false,
      sourceType: ''
    }
  },
  computed: {
    ...mapState('app', [
      'rpc',
      'networks',
      'networkType',
      'filecoinAddress0',
      'deriveIndex'
    ]),
    active () {
      const values = Object.values(this.form)
      const bol = values.every(n => {
        return n !== ''
      })
      return bol
    }
  },
  mounted () {
    const password = getQueryString('password')
    const sourceType = getQueryString('sourceType')
    this.sourceType = sourceType
    const accountName = decodeURIComponent(this.getQuery('accountName'))
    this.$set(this.form, 'accountName', accountName)
    this.$set(this.form, 'password', password)
  },
  methods: {
    ...mapMutations('app', [
      'SET_DERIVEINDEX'
    ]),
    async layoutMounted () {
    },
    async importWallet () {
      if (!this.active) return
      try {
        const mneWords = trimStr(this.form.mnemonicWords)
        const nospace = mneWords.replace(/\s+/ig, ' ')
        const volid = bip39.validateMnemonic(nospace)
        if (volid) {
          this.isFetch = true
          this.error = false
          const { password, accountName } = this.form
          const options = {
            accountName,
            password,
            mnemonicWords: nospace,
            networks: this.networks,
            rpc: this.rpc,
            createType: 'import'
          }
          this.SET_DERIVEINDEX(1)
          setTimeout(async () => {
            await encryptCreate(options, this.sourceType, this.$t('defaultNetworks'))
            this.isFetch = false
            window.location.href = './wallet.html'
          }, 0)
        } else {
          this.error = true
        }
      } catch (error) {
        this.isFetch = false
      }
    },
    focus () {
      this.error = false
    },
    mnemonicWordsChange (val) {
      if (val === '') this.error = false
      this.$set(this.form, 'mnemonicWords', val)
    },
    getQuery (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      let r = window.location.search.substr(1).match(reg)
      let context = ''
      if (r != null) { context = r[2] }
      reg = null
      r = null
      return context == null || context === '' || context === 'undefined' ? '' : context
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style  lang="less" scoped>
.import-words{
    width: 100%;
    margin: 0 auto;
    min-height: 100%;
    background: #fff;
    box-sizing: border-box;
    padding: 20px;
    position: relative;
    .loading{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        .img{
            animation:turnX 3s linear infinite;
        }
        @keyframes turnX{
            0%{
                transform:rotateZ(0deg);
            }
            100%{
                transform:rotateZ(360deg);
            }
        }
    }
    .back{
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        font-size: 18px;
        color: #222;
        cursor: pointer;
    }
    .title{
        color: #222;
        font-size: 18px;
        font-weight: bolder;
        padding: 30px 0 20px;
    }
    .sub-title{
        color: #222;
        font-size: 14px;
        margin-bottom: 10px;
    }
    .input-item{
        margin-bottom: 10px;
        &.error{
            /deep/.input-component{
                .el-textarea__inner{
                    border:1px solid #EA0F0F;
                }
            }
        }
        .label{
            font-size: 14px;
            color: #222;
            margin-bottom: 10px;
        }
    }
    .error-tips{
        font-size: 12px;
        color: #EA0F0F;
    }
    .tips{
        font-size: 12px;
        color: #6A6767;
    }
    .btn-wrap{
        padding-top: 280px;
    }
}
</style>
