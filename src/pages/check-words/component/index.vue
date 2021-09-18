<template>
    <layout>
        <div class="check-wallet">
            <div class="back"><kyBack @pageBack="back"></kyBack></div>
            <div class="content">
                <div class="title">{{$t('checkWords.title')}}</div>
                <div class="sub-title">{{$t('checkWords.subTitle')}}</div>
                <div class="selected" :class="{error}">
                    <div class="selected-item" v-for="(item,index) in selected" :key="index" @click="totgleWords(item)">
                        <div class="w">{{item}}</div>
                        <div class="close"><i class="el-icon-close"></i></div>
                    </div>
                </div>
                <div class="error-tips" v-if="error">{{$t('checkWords.checkError')}}</div>
                <div class="words-select">
                    <div class="words-item"
                        v-for="(item,index) in mnemonicWords" :key="index"
                        :class="{active:selected.includes(item)}"
                        @click="totgleWords(item)"
                    >
                        {{item}}
                    </div>
                </div>
                <div class="btn-wrap">
                    <kyButton :type="'primary'" :active="active" @btnClick="confrim">{{$t('checkWords.btn')}}</kyButton>
                </div>
            </div>
            <div class="loading" v-if="isFetch">
                <img :src="loading" alt="" class="img">
            </div>
        </div>
    </layout>
</template>
<script>
import layout from '@/components/layout'
import kyButton from '@/components/button'
import { mapMutations, mapState } from 'vuex'
import kyBack from '@/components/back'
import { getQueryString, getF1ByMne, setGlabolKek } from '@/utils'
import { genSalt, genKek, AESEncrypt } from '@/utils/key'
import { Database } from '@/utils/database.js'

export default {
  data () {
    return {
      loading: require('@/assets/image/loading.png'),
      isFetch: false,
      selected: [],
      accountName: '',
      password: '',
      mnemonicWords: [],
      error: false,
      db: null
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
      return this.selected.length === 12
    }
  },
  components: {
    layout,
    kyButton,
    kyBack
  },
  async mounted () {
    const accountName = decodeURIComponent(this.getQuery('accountName'))
    const password = getQueryString('password')
    const mnemonicWords = getQueryString('mnemonicWords').split(' ')
    this.accountName = accountName
    this.password = password
    this.createType = getQueryString('createType')
    this.mnemonicWords = this.shuffle(mnemonicWords)
    const db = new Database()
    this.db = db
  },
  methods: {
    ...mapMutations('app', [
      'SET_DERIVEINDEX'
    ]),
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
      const mnemonicWords = getQueryString('mnemonicWords')
      window.location.href = `./create-words.html?mnemonicWords=${mnemonicWords}&accountName=${this.accountName}&password=${this.password}&createType=${this.createType}`
    },
    totgleWords (words) {
      const include = this.selected.includes(words)
      if (include) {
        const index = this.selected.indexOf(words)
        this.selected.splice(index, 1)
      } else {
        this.selected.push(words)
      }
    },
    shuffle (arr) {
      for (let i = arr.length - 1; i >= 0; i--) {
        const rIndex = Math.floor(Math.random() * (i + 1))
        const temp = arr[rIndex]
        arr[rIndex] = arr[i]
        arr[i] = temp
      }
      return arr
    },
    async confrim () {
      if (!this.active) return
      try {
        const mne = getQueryString('mnemonicWords')
        const mneArr = mne.split(' ')
        const bol = this.arrayEquals(this.selected, mneArr)
        if (bol) {
          this.isFetch = true
          this.error = false
          setTimeout(async () => {
            const kek = genKek(this.password)
            const ethereumF1 = await getF1ByMne(mne, kek, 'ethereum', '', 0)
            const filecoinF1 = await getF1ByMne(mne, kek, 'proxy', 'f', 0)
            const calibrationF1 = await getF1ByMne(mne, kek, 'proxy', 't', 0)

            const { address, privateKey, digest } = filecoinF1
            const accountName = this.accountName
            // eslint-disable-next-line camelcase
            const create_time = parseInt(new Date().getTime() / 1000)
            this.SET_DERIVEINDEX(1)
            await this.db.modifyTable(
              'activenNetworks',
              { rpc: this.rpc },
              { deriveIndex: 1 }
            )
            const _account = []
            const _networks = []
            for (const n of this.networks) {
              if (n.filecoinAddress0 === 'f') {
                _account.push({
                  accountName,
                  address: filecoinF1.address,
                  createType: 'mnemonic',
                  privateKey: filecoinF1.privateKey,
                  create_time,
                  khazix: 'khazix',
                  digest: filecoinF1.digest,
                  fil: 0,
                  isDelete: 0,
                  rpc: n.rpc
                })
              } else if (n.filecoinAddress0 === 't') {
                _account.push({
                  accountName,
                  address: calibrationF1.address,
                  createType: 'mnemonic',
                  privateKey: calibrationF1.privateKey,
                  create_time,
                  khazix: 'khazix',
                  digest: calibrationF1.digest,
                  fil: 0,
                  isDelete: 0,
                  rpc: n.rpc
                })
              } else {
                _account.push({
                  accountName,
                  address: ethereumF1.address,
                  createType: 'mnemonic',
                  privateKey: ethereumF1.privateKey,
                  create_time,
                  khazix: 'khazix',
                  digest: ethereumF1.digest,
                  fil: 0,
                  isDelete: 0,
                  rpc: n.rpc
                })
              }
              _networks.push({
                ...n,
                deriveIndex: 1
              })
            }
            await this.db.bulkAddTable('accountList', _account)
            await this.db.bulkPutTable('networks', _networks)
            await this.db.addTable('activeAccount', {
              address,
              accountName,
              privateKey,
              createType: 'mnemonic',
              create_time,
              khazix: 'khazix',
              fil: 0,
              digest,
              rpc: this.rpc
            })

            const salt = genSalt(this.password)
            setGlabolKek(kek)
            const mnemonic = AESEncrypt(mne, kek)
            await this.db.addTable('walletKey', {
              mnemonicWords: mnemonic,
              salt,
              rpc: this.rpc,
              khazix: 'khazix'
            })
            this.isFetch = false
            window.location.href = './wallet.html'
          }, 0)
        } else {
          this.error = true
        }
      } catch (error) {
        console.log(error, 'error')
      }
    },
    arrayEquals (array1, array2) {
      return array1.length === array2.length && array1.every(function (v, i) { return v === array2[i] })
    }
  }
}
</script>

<style  lang="less" scoped>
.check-wallet{
    width: 100%;
    margin: 0 auto;
    min-height: 100%;
    background: #fff;
    box-sizing: border-box;
    padding: 20px 0;
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
        padding: 0 20px;
    }
    .content{
       .title{
            color: #201F1F;
            font-size: 20px;
            font-weight: bolder;
            padding: 30px 20px 20px;
        }
        .sub-title{
            color: #201F1F;
            font-size: 14px;
            margin-bottom: 10px;
            padding: 0 20px;
        }
        .selected{
            width: 320px;
            height: 175px;
            background: #F5F5F5;
            border-radius: 10px;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            padding:10px 11px;
            box-sizing: border-box;
            margin: 0 auto;
            &.error{
                border:1px solid #EA0F0F;
            }
            .selected-item{
                width: 92px;
                height: 31px;
                line-height: 31px;
                color: #201F1F;
                margin-right: 10px;
                border-radius: 5px;
                margin-bottom: 10px;
                position: relative;
                cursor: pointer;
                background: #AFE0E5;
                &:nth-child(3n){
                    margin-right: 0;
                }
                .w{
                    height: 30px;
                    line-height: 30px;
                    color: #201F1F;
                    text-align: center;
                }
                .close{
                    position: absolute;
                    top:-7px;
                    right:2px;
                    font-size: 12px;
                    color: #9B9393;
                    transform: scale(.8);
                    cursor: pointer;
                }
            }
        }
        .error-tips{
            color: #EA0F0F;
            font-size: 14px;
            padding: 10px 20px 0;
        }
        .words-select{
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            padding: 20px 10px 0 20px;
            .words-item{
                width: 100px;
                height: 31px;
                line-height: 31px;
                color: #201F1F;
                background: #F1F3FD;
                border-radius: 4px;
                text-align: center;
                font-size: 14px;
                margin-right: 10px;
                margin-bottom: 10px;
                cursor: pointer;
                &:hover{
                    background: #AFE0E5;
                }
                &.active{
                    width: 0;
                    height: 0;
                    display: none;
                }
            }
        }
        .btn-wrap{
            padding:30px 20px 0;
        }
    }
}
</style>
