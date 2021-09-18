<template>
    <layout @layoutMounted="layoutMounted">
        <div class="import-privatkey">
            <kyBack @pageBack="back"/>
            <div class="title">{{$t('importPrivatkey.title')}}</div>
            <div class="input-item">
                <div class="label">{{$t('importPrivatkey.label1')}}</div>
                <div class="select-network" @click="selectNet">
                    <div class="value">{{ netName }}</div>
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>

            <div class="input-item">
                <div class="label">{{$t('importPrivatkey.label2')}}</div>
                <kyInput :value="privatekey" type="textarea" :rows="3" @changeInput="privatekeyChange"></kyInput>
            </div>
            <div class="btn-wrap">
                <kyButton :type="'primary'" :active="active" @btnClick="importWallet">
                    {{$t('importPrivatkey.btn')}}
                </kyButton>
            </div>
            <div class="loading" v-if="isFetch">
                <img :src="loading" alt="" class="img">
            </div>
        </div>
        <el-dialog
            :visible.sync="networkVisible"
            width="300px"
            :show-close="false"
            top="30vh"
        >
            <kyNetwork :networks="networks" @confirmNet="confirmNet" @closeNet="closeNet" :net="net"/>
        </el-dialog>
    </layout>
</template>

<script>
import { trimStr, getF1ByPrivateKey, isFilecoinChain, getGlobalKek } from '@/utils'
import layout from '@/components/layout'
import kyInput from '@/components/input'
import kyButton from '@/components/button'
import kyBack from '@/components/back'
import kyNetwork from './select-network.vue'
import { mapMutations, mapState } from 'vuex'

import { Database } from '@/utils/database.js'
export default {
  data () {
    return {
      loading: require('@/assets/image/loading.png'),
      privatekey: '',
      isFetch: false,
      center: true,
      net: '',
      networkVisible: false,
      mnePsd: null,
      customNetworkType: '',
      customFilecoinAddress0: '',
      kek: null,
      db: null
    }
  },
  computed: {
    ...mapState('app', [
      'rpc',
      'networks',
      'accountList',
      'activeAccount',
      'networkType',
      'filecoinAddress0',
      'deriveIndex'
    ]),
    active () {
      return this.net !== '' && this.privatekey !== ''
    },
    netName () {
      let str = ''
      const obj = this.networks.find(n => {
        return n.rpc === this.net
      })
      if (obj) {
        str = obj.name
      }
      return str
    }
  },
  components: {
    layout,
    kyInput,
    kyButton,
    kyBack,
    kyNetwork
  },
  async mounted () {
    const kek = getGlobalKek()
    this.kek = kek
    const db = new Database()
    this.db = db
  },
  methods: {
    ...mapMutations('app', [
      'SET_RPC',
      'SET_RPCNAME',
      'SET_BROWSER',
      'SET_ACCOUNTLIST',
      'SET_SYMBOL',
      'SET_IDS',
      'SET_NETWORKTYPE',
      'SET_FILECOINADDRESS0',
      'SET_DECIMALS',
      'SET_OWENCHAIN',
      'SET_RPCIMAGE',
      'SET_DERIVEINDEX'
    ]),
    async layoutMounted () {
      this.net = this.rpc
      this.customNetworkType = this.networkType
      this.customFilecoinAddress0 = this.filecoinAddress0
    },
    privatekeyChange (val) {
      this.privatekey = val
    },
    selectNet () {
      this.networkVisible = true
    },
    confirmNet (val) {
      console.log(val, 'val 1234')
      this.net = val.rpc
      this.customNetworkType = val.networkType
      this.customFilecoinAddress0 = val.filecoinAddress0
      this.networkVisible = false
    },
    closeNet () {
      this.networkVisible = false
    },
    async importWallet () {
      if (this.privatekey) {
        try {
          this.isFetch = true
          const f1 = await this.getf1ByCK()
          if (f1) {
            const { address, privateKey, digest } = f1
            const isExist = this.accountList.find(n => {
              return n.address === address
            })
            if (!isExist) {
              let obj = null
              const isFileCoin = isFilecoinChain(this.customNetworkType)
              const _account = []
              const _accountList_ = await this.db.getTable('accountList', { rpc: this.rpc })
              const accountName = 'Account' + (_accountList_.length + 1)
              // eslint-disable-next-line camelcase
              const create_time = parseInt(new Date().getTime() / 1000)
              this.networks.forEach(n => {
                if (n.rpc === this.net) {
                  obj = n
                }
                if (isFileCoin === isFilecoinChain(n.networkType)) {
                  if (isFileCoin) {
                    const _add = address.substring(1, address.length)
                    _account.push({
                      accountName,
                      address: n.filecoinAddress0 + _add,
                      createType: 'privateKey',
                      privateKey,
                      create_time,
                      khazix: 'khazix',
                      digest,
                      fil: 0,
                      isDelete: 0,
                      rpc: n.rpc
                    })
                  } else {
                    _account.push({
                      accountName,
                      address,
                      createType: 'privateKey',
                      privateKey,
                      create_time,
                      khazix: 'khazix',
                      digest,
                      isDelete: 0,
                      fil: 0,
                      rpc: n.rpc
                    })
                  }
                }
              })
              const {
                name,
                rpc,
                symbol,
                browser,
                networkType,
                filecoinAddress0,
                ids,
                decimals,
                image,
                disabled,
                deriveIndex
              } = obj
              await this.db.bulkAddTable('accountList', _account)
              await this.db.deleteTable('activeAccount', { khazix: 'khazix' })
              await this.db.addTable('activeAccount', {
                address,
                accountName,
                privateKey,
                create_time,
                khazix: 'khazix',
                createType: 'privateKey',
                fil: 0,
                digest,
                rpc: this.net
              })
              await this.db.deleteTable('activenNetworks', { khazix: 'khazix' })
              await this.db.addTable('activenNetworks', {
                ...obj,
                khazix: 'khazix'
              })
              const accountList = await this.db.getTable('accountList', { rpc: rpc, isDelete: 0 })
              this.SET_RPC(rpc)
              this.SET_RPCNAME(name)
              this.SET_BROWSER(browser)
              this.SET_ACCOUNTLIST(accountList)
              this.SET_SYMBOL(symbol)
              this.SET_IDS(ids)
              this.SET_NETWORKTYPE(networkType)
              this.SET_FILECOINADDRESS0(filecoinAddress0)
              this.SET_DECIMALS(decimals)
              this.SET_OWENCHAIN(disabled)
              this.SET_RPCIMAGE(image)
              this.SET_DERIVEINDEX(deriveIndex)
              this.isFetch = false
              window.location.href = './wallet.html'
            } else {
              this.isFetch = false
              this.$message.error(this.$t('importPrivatkey.exist'))
            }
          } else {
            this.isFetch = false
            this.$message.error(this.$t('importPrivatkey.importError'))
          }
        } catch (err) {
          console.log(err, 'err')
          this.isFetch = false
        }
      }
    },
    async getf1ByCK () {
      const thisPk = trimStr(this.privatekey)
      try {
        if (isFilecoinChain(this.customNetworkType)) {
          const keyStore = JSON.parse(Buffer.from(thisPk, 'hex').toString())
          if (keyStore.Type === 'bls') {
            return null
          } else {
            const privateKey = keyStore.PrivateKey
            const f1 = await getF1ByPrivateKey(privateKey, this.kek, this.customNetworkType, this.customFilecoinAddress0)
            return f1
          }
        } else {
          const f1 = await getF1ByPrivateKey(thisPk, this.kek, this.customNetworkType, this.customFilecoinAddress0)
          return f1
        }
      } catch (error) {
        console.log(error, 'err')
        this.isFetch = false
        return null
      }
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style  lang="less" scoped>
.import-privatkey{
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
    .title{
        color: #222;
        font-size: 18px;
        font-weight: bolder;
        padding-top: 30px;
        margin-bottom: 30px;
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
        .select-network{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            height: 36px;
            background: #F5F5F5;
            border-radius: 5px;
            cursor: pointer;
            .value{
                flex-grow: 1;
            }
        }
    }
    .btn-wrap{
        padding-top: 30px;
    }
}
/deep/.el-dialog{
    border-radius: 10px;
    .el-dialog__header{
        padding: 0;
    }
    .el-dialog__body{
        padding: 0;
    }
}
</style>
