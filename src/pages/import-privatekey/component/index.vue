<template>
    <ky-layout @layoutMounted="layoutMounted">
        <div class="import-privatkey">
            <ky-back @pageBack="back"/>
            <div class="title">{{$t('importPrivatkey.title')}}</div>
            <div class="import-content">
              <div class="input-item">
                <div class="label">{{$t('importPrivatkey.label1')}}</div>
                <div class="select-network" @click="selectNet">
                    <div class="value">{{ netName }}</div>
                    <i class="el-icon-arrow-right"></i>
                </div>
              </div>
              <div class="input-item">
                  <div class="label">{{$t('importPrivatkey.label2')}}</div>
                  <ky-input :value="privatekey" type="textarea" :rows="3" @changeInput="privatekeyChange"></ky-input>
              </div>
            </div>

            <div class="btn-wrap">
                <ky-button :type="'primary'" :active="active" @btnClick="importWallet">
                    {{$t('importPrivatkey.btn')}}
                </ky-button>
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

        <el-dialog
          :visible.sync="passwordVisable"
          width="300px"
          :show-close="false"
          class="password-verification"
          :top="'34vh'"
        >
          <password-verification
            v-if="passwordVisable"
            @confirm="confirmPassword"
            @close="closePassword"
          >
          </password-verification>
        </el-dialog>
    </ky-layout>
</template>

<script>
import passwordVerification from '@/components/password-verification'
import { trimStr, getF1ByPrivateKey, isFilecoinChain } from '@/utils'
import kyNetwork from './select-network.vue'
import { mapMutations, mapState } from 'vuex'
import { importCreate } from '@/utils/encrypt'
export default {
  components: {
    passwordVerification,
    kyNetwork
  },
  data () {
    return {
      loading: require('@/assets/image/loading.png'),
      privatekey: '',
      isFetch: false,
      center: true,
      net: '',
      networkVisible: false,
      passwordVisable: false,
      mnePsd: null,
      customNetwork: ''
    }
  },
  computed: {
    ...mapState('app', [
      'rpc',
      'networks',
      'accountList',
      'activeNetwork'
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
  methods: {
    ...mapMutations('app', [
      'SET_ACCOUNTLIST',
      'SET_CUSTOMNETWORK'
    ]),
    async layoutMounted () {
      this.net = this.rpc
      this.customNetwork = this.activeNetwork
    },
    privatekeyChange (val) {
      this.privatekey = val
    },
    selectNet () {
      this.networkVisible = true
    },
    confirmNet (val) {
      this.net = val.rpc
      this.customNetwork = val
      this.networkVisible = false
    },
    closeNet () {
      this.networkVisible = false
    },
    async confirmPassword (password) {
      this.passwordVisable = false
      try {
        if (!this.privatekey) {
          return
        }
        this.isFetch = true
        const f1 = await this.getf1ByCK(password)
        if (f1) {
          const accountList = this.accountList
          const _customNetworkAccount = accountList.filter(n => n.rpc === this.customNetwork.rpc)
          const _index = _customNetworkAccount.length + 1
          const accountName = 'Account' + _index
          const _customNetwork = {
            ...this.customNetwork,
            accountName
          }
          const options = {
            encryptKey: f1,
            accountList: this.accountList,
            networks: this.networks,
            customNetwork: _customNetwork,
            net: this.net,
            thisRpc: this.rpc,
            rpcName: this.rpcName
          }
          const resule = await importCreate(options)
          if (resule != null) {
            this.SET_ACCOUNTLIST(accountList)
            this.SET_CUSTOMNETWORK(_customNetwork)
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
        this.isFetch = false
      }
    },
    closePassword () {
      this.passwordVisable = false
    },
    async importWallet () {
      this.passwordVisable = true
    },
    async getf1ByCK (password) {
      const thisPk = trimStr(this.privatekey)
      const customNetwork = this.customNetwork
      try {
        if (isFilecoinChain(customNetwork.networkType)) {
          const keyStore = JSON.parse(Buffer.from(thisPk, 'hex').toString())
          if (keyStore.Type === 'bls') {
            return null
          } else {
            const privateKey = keyStore.PrivateKey
            const f1 = await getF1ByPrivateKey(privateKey, password, customNetwork.networkType, customNetwork.filecoinAddress0)
            return f1
          }
        } else {
          const f1 = await getF1ByPrivateKey(thisPk, password, customNetwork.networkType, customNetwork.filecoinAddress0)
          return f1
        }
      } catch (error) {
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
    display: flex;
    flex-direction: column;
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
    .import-content{
      flex-grow: 1;
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
