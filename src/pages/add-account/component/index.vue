<template>
  <ky-layout @layoutMounted="layoutMounted">
    <div class="add-account-page">
      <div class="add-top">
        <div class="back-warp">
          <ky-back @pageBack="back"></ky-back>
        </div>
      </div>
      <div class="add-content">
        <div class="title">{{ $t("addAccount.title") }}</div>
        <div class="input-item">
          <div class="label">{{ $t("addAccount.nameLabel") }}</div>
          <ky-input
            :value="name"
            maxlength='15'
            type="text"
            @changeInput="nameChange"
          ></ky-input>
          <div class="name-tips">{{ $t("addAccount.nameTips")}}</div>
        </div>
        <div class="tips">{{ $t("addAccount.tips") }}</div>
      </div>

      <ky-button
        :type="'primary'"
        :active="active"
        @btnClick="confirm"
      >
        {{$t('addAccount.button')}}
      </ky-button>
    </div>
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
import { mapMutations, mapState } from 'vuex'
import ExtensionStore from '@/utils/local-store'
import { getF1ByMne, isFilecoinChain } from '@/utils'
import { decrypt } from '@/utils/aes-gcm.js'
export default {
  components: {
    passwordVerification
  },
  data () {
    return {
      passwordVisable: false,
      encryptMnemonic: '',
      ebcryptAddress: '',
      filecoinObj: null,
      calibrationObj: null,
      ethereumObj: null,
      name: ''
    }
  },
  computed: {
    ...mapState('app', [
      'address',
      'rpc',
      'networkType',
      'accountList',
      'networks',
      'deriveIndex',
      'activeNetwork',
      'filecoinAddress0'
    ]),
    active () {
      return this.name !== ''
    }
  },
  methods: {
    ...mapMutations('app', [
      'SET_DERIVEINDEX'
    ]),
    async layoutMounted () {
      const localStore = new ExtensionStore()
      this.localStore = localStore
      const index = this.accountList.length
      this.name = 'Account' + (index + 1)
      const walletKey = await localStore.get('walletKey')
      if (walletKey) {
        const { mnemonicWords, address } = walletKey
        this.encryptMnemonic = mnemonicWords
        this.ebcryptAddress = address
      }
    },
    nameChange (value) {
      this.name = value
    },
    async confirmPassword (password) {
      try {
        this.passwordVisable = false
        const _mnemonic = await decrypt(this.encryptMnemonic, this.ebcryptAddress)
        if (_mnemonic) {
          const isFilecoin = isFilecoinChain(this.networkType)
          if (isFilecoin) {
            const filecoinObj = await getF1ByMne(_mnemonic, password, 'filecoin', 'f', this.deriveIndex)
            const calibrationObj = await getF1ByMne(_mnemonic, password, 'filecoin', 't', this.deriveIndex)
            this.filecoinObj = filecoinObj
            this.calibrationObj = calibrationObj
            if (this.filecoinAddress0 === 'f') {
              this.activeObj = filecoinObj
            } else {
              this.activeObj = calibrationObj
            }
          } else {
            const ethereumObj = await getF1ByMne(_mnemonic, password, 'ethereum', '', this.deriveIndex)
            this.ethereumObj = ethereumObj
            this.activeObj = ethereumObj
          }
          const createTime = parseInt(new Date().getTime() / 1000)
          const accountName = this.name
          const _index = this.deriveIndex + 1
          await this.localStore.set({
            activeAccount: {
              address: this.activeObj.address,
              accountName,
              privateKey: this.activeObj.privateKey,
              rpc: this.rpc,
              createTime,
              fil: 0,
              createType: 'mnemonic'
            }
          })
          const _accountList = []
          const _networks = []
          let _obj = null
          for (const n of this.networks) {
            const _networkType = isFilecoinChain(n.networkType)
            if (_networkType) {
              if (n.filecoinAddress0 === 'f') {
                _obj = this.filecoinObj
              } else {
                _obj = this.calibrationObj
              }
            } else {
              _obj = this.ethereumObj
            }
            if (isFilecoin === _networkType) {
              _networks.push({
                ...n,
                deriveIndex: _index
              })
              _accountList.push({
                accountName,
                address: _obj.address,
                createType: 'mnemonic',
                createTime,
                privateKey: _obj.privateKey,
                rpc: n.rpc,
                fil: 0
              })
            } else {
              _networks.push({
                ...n
              })
            }
          }
          const allAccountList = await this.localStore.get('accountList') || []
          await this.localStore.set({
            accountList: [
              ...allAccountList,
              ..._accountList
            ]
          })

          await this.localStore.set({ networks: _networks })
          await this.localStore.set({
            activeNetwork: {
              ...this.activeNetwork,
              deriveIndex: _index
            }
          })
          this.SET_DERIVEINDEX(_index)
          this.isFetch = false
          window.location.href = './wallet.html'
        }
      } catch (error) {
        this.isFetch = false
      }
    },
    closePassword () {
      this.passwordVisable = false
    },
    confirm () {
      this.passwordVisable = true
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style  lang="less" scoped>
.add-account-page {
  width: 100%;
  margin: 0 auto;
  min-height: 100%;
  background: #fff;
  position: relative;
  display: flex;
  padding: 0 20px 20px;
  box-sizing: border-box;
  flex-direction: column;
  .add-top {
    padding: 15px 0;
    border-bottom: 1px solid #f6f7ff;
  }

  .add-content {
    flex-grow: 1;
    padding: 15px 0;
    .title {
      font-size: 14px;
      font-size: 20px;
      margin-bottom: 25px;
      color: #101010;
    }
    .input-item{
      .label{
        font-size: 14px;
        color: #201F1F;
        margin-bottom: 5px;
      }
      .name-tips{
        font-size: 12px;
        color: #737171;
        padding: 5px 0;
      }
    }
    .tips{
      font-size: 12px;
      color: #6A6767;
    }
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
