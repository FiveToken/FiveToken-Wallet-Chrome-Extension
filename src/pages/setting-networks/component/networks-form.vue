<template>
<div class="networks-form">
    <div class="back">
        <ky-back @pageBack="back" :name="pageName"/>
    </div>
    <div class="add-networks">
        <div class="tips">{{$t('settingNetworks.addTips')}}</div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.networkName')}}</div>
            <ky-input :value="form.name" :disabled="form.disabled" @changeInput="changeForm(arguments,'name')"/>
        </div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.rpc')}}</div>
            <ky-input :value="form.rpc" :disabled="form.disabled" @changeInput="changeForm(arguments,'rpc')"/>
        </div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.chainID')}}</div>
            <ky-input :value="form.chainID" :disabled="form.disabled" @changeInput="changeForm(arguments,'chainID')"/>
        </div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.symbol')}}</div>
            <ky-input :value="form.symbol" :disabled="form.disabled" @changeInput="changeForm(arguments,'symbol')"/>
        </div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.browser')}}</div>
            <ky-input :value="form.browser" :disabled="form.disabled" @changeInput="changeForm(arguments,'browser')"/>
        </div>
        <div class="btn-wrap" :class="{two:!form.disabled && detail}">
            <ky-button v-if="!form.disabled && detail" @btnClick="deleteNetwork" >{{$t('settingNetworks.delete')}}</ky-button>
            <ky-button type="primary" v-if="!form.disabled" :active="active" @btnClick="save">{{$t('settingNetworks.save')}}</ky-button>
        </div>
    </div>
    <div class="loading" v-if="isFetch">
        <img :src="loading" alt="" class="img">
    </div>
    <el-dialog
        :visible.sync="deleteNetworkVisible"
        width="300px"
        :show-close="false"
        :top="'50vh'"
    >
        <deleteNetwork
            @confirmDelete="confirmDelete"
            @closeDelete="closeDelete"
        />
    </el-dialog>
</div>
</template>

<script>
import deleteNetwork from './delete-network.vue'
import { GlobalApi } from '@/api/index.js'
import { mapState } from 'vuex'
import ExtensionStore from '@/utils/local-store'
export default {
  components: {
    deleteNetwork
  },
  props: {
    detail: Object,
    pageType: String,
    deleteRpc: String
  },
  data () {
    return {
      deleteNetworkVisible: false,
      form: {
        name: '',
        rpc: '',
        chainID: '',
        symbol: '',
        browser: '',
        disabled: false
      },
      loading: require('@/assets/image/loading.png'),
      isFetch: false,
      localStore: null
    }
  },
  computed: {
    ...mapState('app', [
      'rpc',
      'networkType',
      'filecoinAddress0',
      'accountList',
      'networks'
    ]),
    pageName () {
      let str = ''
      if (this.form.disabled) {
        str = this.$t('settingNetworks.viewNetwork')
      } else {
        if (this.detail) {
          str = this.$t('settingNetworks.editNewwork')
        } else {
          str = this.$t('settingNetworks.addNetwork')
        }
      }
      return str
    },
    active () {
      return this.form.name !== '' && this.form.rpc !== '' && this.form.chainID !== '' && this.form.symbol !== '' && !this.form.disabled
    }
  },
  watch: {
    detail: {
      handler (newval, old) {
        if (newval) {
          this.form = Object.assign({}, this.form, { ...newval })
          this.$set(this.form, 'disabled', newval.disabled)
        }
      },
      deep: true,
      immediate: true
    }
  },
  async mounted () {
    const localStore = new ExtensionStore()
    this.localStore = localStore
  },
  methods: {
    async confirmDelete () {
      const that = this
      const accountList = this.accountList
      const networks = this.networks
      try {
        if (this.rpc === this.deleteRpc) {
          const currentRpc = this.rpc
          const dataNetwork = await this.getDataNetwork()
          if (dataNetwork) {
            await this.minixChangeNetwork(dataNetwork, currentRpc)
            if (accountList.length) {
              const _accountList = accountList.filter(n => n.rpc === dataNetwork.rpc)
              if (_accountList.length) {
                await this.minixChangeAccount(_accountList[0], currentRpc)
                that.deleteNetworkVisible = false
                that.$emit('deleteNetworkCb')
                that.$message({
                  type: 'success',
                  message: that.$t('settingNetworks.deleteSuccess'),
                  duration: 1000
                })
              }
            }
          } else {
            localStorage.clear()
            this.localStore.clear()
            window.location.href = './welcome.html'
          }
        } else {
          if (networks.length) {
            const restNetworks = networks.filter(n => n.rpc !== this.deleteRpc)
            this.localStore.set({ networks: restNetworks })
          }
          if (accountList.length) {
            const restAccountList = accountList.filter(n => n.rpc !== this.deleteRpc)
            this.localStore.set({ accountList: restAccountList })
          }
          that.deleteNetworkVisible = false
          that.$emit('deleteNetworkCb')
          that.$message({
            type: 'success',
            message: that.$t('settingNetworks.deleteSuccess'),
            duration: 1000
          })
        }
      } catch (error) {
        that.deleteNetworkVisible = false
      }
    },
    async getDataNetwork () {
      const networks = this.networks
      let dataNetwork = null
      for (let i = 0; i < networks.length; i++) {
        const AllAccountList = await this.localStore.get('accountList')
        if (AllAccountList) {
          const _rpc = networks[i].rpc
          const _accountList = AllAccountList.filter(n => n.rpc === _rpc)
          if (_accountList.length > 0) {
            dataNetwork = networks[i]
            break
          }
        }
      }
      return dataNetwork
    },
    closeDelete () {
      this.deleteNetworkVisible = false
    },
    deleteNetwork () {
      this.deleteNetworkVisible = true
    },
    back () {
      this.$emit('update:pageType', 'list')
    },
    async save () {
      const networks = this.networks
      if (!this.detail) {
        if (networks) {
          const isExist = networks.find(n => {
            return n.rpc === this.form.rpc
          })
          if (isExist) {
            this.$message.error(this.$t('settingNetworks.isExistError'))
            return
          }
        }
      }
      if (this.active) {
        this.isFetch = true
        const MyGlobalApi = new GlobalApi()
        MyGlobalApi.setRpc(this.form.rpc)
        MyGlobalApi.setNetworkType(this.networkType)
        const ethRec = await MyGlobalApi.getBlockNumber(this.form.rpc)
        if (ethRec && ethRec.networkType === 'ethereum') {
          let ids = ''
          if (this.form.symbol.toUpperCase() === 'ETH') {
            ids = 'ethereum'
          }
          if (this.form.symbol.toUpperCase() === 'BNB') {
            ids = 'binancecoin'
          }
          const { networkType, filecoinAddress0 } = ethRec
          let _index = 1
          if (this.detail) {
            _index = this.detail.deriveIndex
          }

          if (this.rpc === this.deleteRpc) {
            await this.localStore.set({
              activeNetwork: {
                name: this.form.name,
                rpc: this.form.rpc,
                chainID: this.form.chainID,
                symbol: this.form.symbol,
                browser: this.form.browser,
                image: '',
                ids: ids,
                decimals: 18,
                networkType: networkType,
                filecoinAddress0,
                deriveIndex: _index,
                disabled: false
              }
            })
          }
          if (networks) {
            const restNetworks = networks.filter(n => n.rpc !== this.deleteRpc)
            this.localStore.set({
              networks: [
                ...restNetworks,
                {
                  name: this.form.name,
                  rpc: this.form.rpc,
                  chainID: this.form.chainID,
                  symbol: this.form.symbol,
                  browser: this.form.browser,
                  disabled: false,
                  networkType,
                  filecoinAddress0,
                  decimals: 18,
                  image: '',
                  ids,
                  deriveIndex: _index
                }
              ]
            })
          }
        } else {
          this.isFetch = false
          this.$message.error(this.$t('settingNetworks.addError'))
          return
        }
        this.isFetch = false
        this.$emit('addNetworkCb')
      }
    },
    changeForm (args, key) {
      if (args) {
        this.$set(this.form, key, args[0])
      }
    }
  }
}
</script>

<style  lang="less" scoped>
/deep/.el-dialog{
    margin: 0 auto;
    border-radius: 10px;
    margin-top: 50vh;
    transform: translateY(-50%);
}
/deep/.el-dialog__header{
    padding:0;
}
/deep/.el-dialog__body{
    padding: 0;
}
/deep/.el-dialog__footer{
    padding: 30px;
    border-top:1px solid #eee;
}
.networks-form{
    height: 100%;
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
        padding:15px 20px;
        border-bottom: 1px solid #F5F5F5;
        margin-bottom: 10px;
    }
    .add-networks{
        padding: 0 20px;
        .tips{
            background: #FDF8EB;
            border-radius: 5px;
            border:1px solid #F7E00A;
            font-size: 12px;
            color: #101010;
            padding: 10px 15px;
            margin-bottom: 15px;
        }

        .input-item{
            margin-bottom: 20px;
            .label{
                margin-bottom: 6px;
                font-size: 14px;
                color: #131313;
            }
            .error{
                padding-top: 5px;
                font-size: 12px;
                color: #FD334C;
            }
        }
        .btn-wrap{
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 15px;
            &.two{
                justify-content: space-between;
                /deep/.button-wrap{
                    width: 155px;
                }
            }
            /deep/.button-wrap{
                width: 100%;
            }
        }
    }
}
</style>
