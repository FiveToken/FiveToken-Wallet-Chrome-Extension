<template>
<div class="networks-form">
    <div class="back">
        <kyBack @pageBack="back" :name="pageName"/>
    </div>
    <div class="add-networks">
        <div class="tips">{{$t('settingNetworks.addTips')}}</div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.networkName')}}</div>
            <kyInput :value="form.name" :disabled="form.disabled" @changeInput="changeForm(arguments,'name')"/>
        </div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.rpc')}}</div>
            <kyInput :value="form.rpc" :disabled="form.disabled" @changeInput="changeForm(arguments,'rpc')"/>
        </div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.chainID')}}</div>
            <kyInput :value="form.chainID" :disabled="form.disabled" @changeInput="changeForm(arguments,'chainID')"/>
        </div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.symbol')}}</div>
            <kyInput :value="form.symbol" :disabled="form.disabled" @changeInput="changeForm(arguments,'symbol')"/>
        </div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.browser')}}</div>
            <kyInput :value="form.browser" :disabled="form.disabled" @changeInput="changeForm(arguments,'browser')"/>
        </div>
        <div class="btn-wrap" :class="{two:!form.disabled && detail}">
            <kyButton @btnClick="deleteNetwork" v-if="!form.disabled && detail">{{$t('settingNetworks.delete')}}</kyButton>
            <kyButton type="primary" v-if="!form.disabled" :active="active" @btnClick="save">{{$t('settingNetworks.save')}}</kyButton>
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
import kyBack from '@/components/back'
import kyInput from '@/components/input'
import kyButton from '@/components/button'
import deleteNetwork from './delete-network.vue'
import { GlobalApi } from '@/api'
import { getF1ByMne, getGlobalKek } from '@/utils'
import { AESDecrypt } from '@/utils/key'
import { mapState, mapMutations } from 'vuex'
import { Database } from '@/utils/database.js'
export default {
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
      kek: '',
      mnemonicWords: '',
      db: null
    }
  },
  props: {
    detail: Object,
    pageType: String,
    deletaRpc: String
  },
  computed: {
    ...mapState('app', [
      'rpc',
      'networkType',
      'filecoinAddress0'
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
        console.log(newval, this, 'newval')
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    kyBack,
    kyInput,
    kyButton,
    deleteNetwork
  },
  async mounted () {
    const kek = getGlobalKek()
    this.kek = kek
    const db = new Database()
    this.db = db
    const walletKey = await db.getTable('walletKey', { khazix: 'khazix' })
    if (walletKey.length) {
      const nme = walletKey[0].mnemonicWords
      const mnemonicWords = AESDecrypt(nme, kek)
      this.mnemonicWords = mnemonicWords
    }
  },
  methods: {
    ...mapMutations('app', [
      'SET_ACTIVENETWORKS',
      'SET_RPC',
      'SET_RPCNAME',
      'SET_ACCOUNTLIST',
      'SET_SYMBOL',
      'SET_PRIVATEKEY',
      'SET_ADDRESS',
      'SET_DIGEST',
      'SET_ACCOUNTNAME',
      'SET_IDS',
      'SET_BROWSER',
      'SET_NETWORKTYPE',
      'SET_FILECOINADDRESS0',
      'SET_DECIMALS',
      'SET_OWENCHAIN',
      'SET_RPCIMAGE',
      'SET_DERIVEINDEX'
    ]),
    async confirmDelete () {
      const that = this
      await this.db.deleteTable('networks', { rpc: this.deletaRpc }).then(res => {
        this.db.deleteTable('accountList', { rpc: this.deletaRpc })
        that.deleteNetworkVisible = false
        that.$emit('deleteNetworkCb')
        that.$message({
          type: 'success',
          message: that.$t('settingNetworks.deleteSuccess'),
          duration: 1000,
          onClose: () => {

          }
        })
      })
      if (this.rpc === this.deletaRpc) {
        await this.db.deleteTable('activenNetworks', { khazix: 'khazix' })

        const networks = await this.db.getTable('networks', { rpc: this.rpc })
        const obj = networks.length && networks[0]
        const { name, rpc, chainID, symbol, browser, ids, networkType, filecoinAddress0, decimals, image, disabled, deriveIndex } = obj
        await this.db.addTable('activenNetworks', {
          name,
          rpc,
          chainID,
          ids,
          symbol,
          browser,
          networkType,
          filecoinAddress0,
          decimals,
          image,
          deriveIndex,
          khazix: 'khazix',
          disabled
        }).then(async (res) => {
          this.$emit('networkChange', obj)
          const accountList = await this.db.getTable('accountList', { rpc: rpc, isDelete: 0 })
          this.SET_RPC(rpc)
          this.SET_RPCNAME(name)
          this.SET_BROWSER(browser)
          this.SET_ACCOUNTLIST(accountList)
          this.SET_SYMBOL(symbol)
          this.SET_IDS(ids)
          this.SET_NETWORKTYPE(networkType)
          this.SET_FILECOINADDRESS0(filecoinAddress0)
          this.SET_ACTIVENETWORKS([obj])
          this.SET_DECIMALS(decimals)
          this.SET_OWENCHAIN(disabled)
          this.SET_RPCIMAGE(image)
          this.SET_DERIVEINDEX(deriveIndex)
          if (accountList.length) {
            const first = accountList[0]
            await this.changeAccount(first)
          } else {
            window.location.href = './welcome.html'
          }
        })
      }
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
      if (!this.detail) {
        const networks = await this.db.getTable('networks', { khazix: 'khazix' })
        const isExist = networks.find(n => {
          return n.rpc === this.form.rpc
        })
        if (isExist) {
          this.$message.error(this.$t('settingNetworks.isExistError'))
          return
        }
      }
      if (this.active) {
        this.isFetch = true
        const MyGlobalApi = new GlobalApi()
        MyGlobalApi.setRpc(this.form.rpc)
        MyGlobalApi.setNetworkType(this.networkType)
        // eslint-disable-next-line camelcase
        const create_time = parseInt(new Date().getTime() / 1000)
        const ethRec = await MyGlobalApi.getBlockNumber(this.form.rpc)
        // let filRec = await MyGlobalApi.getFIleCoinChainHead(this.form.rpc)
        // if(filRec && filRec.networkType === 'filecoin'){
        // this.isFetch = false
        // let { networkType,filecoinAddress0 } = filRec
        // let _index = 1
        // if(this.detail){
        //     _index = this.detail.deriveIndex
        //        await this.db.deleteTable('networks',{rpc:this.deletaRpc})
        // }else{
        //     await this.addUser(networkType,filecoinAddress0,create_time,0)
        //     _index = 1
        // }
        // await this.db.addTable('networks',{
        //     name:this.form.name,
        //     rpc:this.form.rpc,
        //     chainID:this.form.chainID,
        //     symbol:this.form.symbol,
        //     browser:this.form.browser,
        //     disabled:false,
        //     create_time,
        //     ids:'filecoin',
        //     networkType,
        //     filecoinAddress0,
        //     decimals:18,
        //     image:'',
        //     deriveIndex:_index,
        //     khazix:'khazix'
        // })
        // }
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
            await this.db.deleteTable('networks', { rpc: this.deletaRpc })
          } else {
            await this.addUser(networkType, filecoinAddress0, create_time, 0)
            _index = 1
          }
          if (this.rpc === this.deletaRpc) {
            console.log(this.rpc === this.deletaRpc, 'this.rpc === this.deletaRpc')
            let dIndex = 0
            if (this.form.rpc === this.deletaRpc) {
              dIndex = this.detail.deriveIndex
            } else {
              await this.addUser(networkType, filecoinAddress0, create_time, 0)
              dIndex = 1
            }
            await this.db.modifyTable(
              'activenNetworks',
              {
                rpc: this.detail.rpc
              },
              {
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
                deriveIndex: dIndex,
                disabled: false,
                khazix: 'khazix'
              }
            )
          }

          await this.db.addTable('networks', {
            name: this.form.name,
            rpc: this.form.rpc,
            chainID: this.form.chainID,
            symbol: this.form.symbol,
            browser: this.form.browser,
            disabled: false,
            create_time,
            networkType,
            filecoinAddress0,
            decimals: 18,
            image: '',
            ids,
            deriveIndex: _index,
            khazix: 'khazix'
          })
        } else {
          this.isFetch = false
          this.$message.error(this.$t('settingNetworks.addError'))
          return
        }
        this.isFetch = false
        this.$emit('addNetworkCb')
      }
    },
    // eslint-disable-next-line camelcase
    async addUser (networkType, filecoinAddress0, create_time, index) {
      const accountName = 'Account' + 1
      const f1 = await getF1ByMne(this.mnemonicWords, this.kek, networkType, filecoinAddress0, index)
      const { address, privateKey, digest } = f1
      await this.db.addTable('accountList', {
        address,
        accountName,
        createType: 'mnemonic',
        privateKey,
        fil: 0,
        create_time,
        khazix: 'khazix',
        digest,
        isDelete: 0,
        rpc: this.form.rpc
      })
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
