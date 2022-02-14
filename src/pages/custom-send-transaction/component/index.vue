<template>
  <div class="custom-send-transaction">
    <ky-layout @layoutMounted="layoutMounted">
      <div class="network" @click="wallet">{{rpcName}}</div>
      <div class="from-to">
        <div class="from">{{ formData.address | addressFormat }}</div>
        <div class="l">
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="to">{{ formData.to | addressFormat }}</div>
      </div>
      <div class="info">
        <div class="origin">{{origin}}</div>
        <div class="label">{{$t('customSendTransaction.transfer')}}</div>
        <div class="amount">
          <div class="logo"></div>
          <div class="value">{{formData.value}} {{formData.symbol}}</div>
        </div>
      </div>
      <componentDeatil
        :formData="formData"
        :priceCurrency="priceCurrency"
        @formDataChange="formDataChange"
      />
      <div class="button-group">
        <ky-button @btnClick="cancel">
          {{$t('customSendTransaction.cancel')}}
        </ky-button>
        <ky-button :type="'primary'" :active="active" @btnClick="confirm">
          {{$t('customSendTransaction.confirm')}}
        </ky-button
        >
      </div>
      <div class="loading" v-if="isFetch">
        <img :src="loading" alt="" class="img">
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
  </div>
</template>

<script>
import componentDeatil from './detail.vue'
import { mapMutations, mapState } from 'vuex'
import { GlobalApi } from '@/api/index.js'
import ExtensionStore from '@/utils/local-store'
import { bigNumbers, isFilecoinChain } from '@/utils'
import { popupToBackground, popupWindowRemove } from '@/popup.js'
import passwordVerification from '@/components/password-verification'
import { decryptMessage, encrypt } from '@/utils/aes-gcm'
export default {
  components: {
    componentDeatil,
    passwordVerification
  },
  filters: {
    addressFormat (val) {
      if (val.length > 12) {
        return val.substr(0, 6) + '...' + val.substr(val.length - 6, 6)
      } else {
        return val
      }
    }
  },
  data () {
    return {
      passwordVisable: false,
      active: true,
      origin: '',
      type: 0,
      loading: require('@/assets/image/loading.png'),
      isFetch: false,
      formData: {
        balance: 0,
        address: '',
        to: '',
        value: '',
        gasFeeCap: '',
        gasLimit: '',
        gasPremium: '',
        nonce: 0
      },
      priceCurrency: 0,
      localStore: null
    }
  },
  computed: {
    ...mapState('app', [
      'privateKey',
      'rpc',
      'networkType',
      'rpcName',
      'ids'
    ])
  },
  created () {
    const origin = window.localStorage.getItem('fiveTokenConnectOrigin')
    this.origin = origin
    const stringParams = window.localStorage.getItem('fiveTokenSendTeansaction')
    const params = JSON.parse(stringParams)
    this.formData = Object.assign({}, this.formData, params)
    this.localStore = new ExtensionStore()
  },
  methods: {
    ...mapMutations('send-fil', ['SET_SERVICEGAS']),
    async layoutMounted () {
      this.getFilPricePoints()
      if (isFilecoinChain(this.networkType)) {
        this.SET_SERVICEGAS({
          rpcType: 'filecoin',
          gasPrice: 0,
          maxPriorityFeePerGas: 0,
          maxFeePerGas: 0,
          gasLimit: Number(this.formData.gasLimit),
          gasPremium: Number(this.formData.gasPremium),
          gasFeeCap: Number(this.formData.gasFeeCap)
        })
      } else {
        this.$message.error(this.$t('customSendTransaction.noSupported'))
      }
    },
    async confirmPassword (password) {
      const _salt = await encrypt(password, this.address)
      const _privateKey = await decryptMessage(this.privateKey, _salt, this.address)
      this.isFetch = true
      try {
        const gasFeeCap = bigNumbers(this.formData.gasFeeCap)
        const tx = {
          from: this.formData.address,
          to: this.formData.to,
          value: this.formData.value,
          privateKey: _privateKey,
          nonce: this.formData.nonce,
          GasPremium: this.formData.gasPremium,
          GasFeeCap: gasFeeCap.multipliedBy(Math.pow(10, 9)).toNumber(),
          GasLimit: Math.ceil(this.formData.gasLimit)
        }
        // create Api
        const MyGlobalApi = new GlobalApi()
        MyGlobalApi.setRpc(this.rpc)
        MyGlobalApi.setNetworkType(this.networkType)
        const result = await MyGlobalApi.sendTransaction(tx)
        if (result && result.cid) {
          const handlingFee = (bigNumbers(this.formData.gasPremium).plus(this.formData.gasFeeCap)).multipliedBy(this.formData.gasLimit)
          const value = bigNumbers(this.formData.value).multipliedBy(Math.pow(10, 18)).toNumber()
          await this.storeMessage({ value, cid: result.cid, nonce: result.nonce, handlingFee })
          popupToBackground('fil_sendTransaction', { cid: result.cid })
          popupWindowRemove()
        }
        this.isFetch = false
      } catch (error) {
        this.isFetch = false
      }
    },
    // Successfully sent and stored in the message
    async storeMessage (data) {
      const createTime = parseInt(new Date().getTime() / 1000)
      const messageList = await this.localStore.get('messageList') || []
      const message = {
        cid: data.cid,
        from: this.address,
        to: this.formData.to,
        createTime,
        blockTime: 0,
        nonce: data.nonce,
        allGasFee: data.handlingFee,
        decimals: this.formData.decimals,
        token: this.formData.symbol,
        type: 'pending',
        value: data.value,
        rpc: this.rpc
      }
      await this.localStore.set({
        messageList: [
          ...messageList,
          message
        ]
      })

      const addressRecordLast = await this.localStore.get('addressRecordLast') || []
      const restRecordList = addressRecordLast.filter(n => {
        return (n.address !== this.formData.to) && (n.rpc !== this.rpx)
      })
      const addressRecord = {
        address: this.formData.to,
        rpc: this.rpc
      }
      await this.localStore.set({
        addressRecordLast: [
          ...restRecordList,
          addressRecord
        ]
      })
    },
    closePassword () {
      this.passwordVisable = false
    },
    // get exchange rate
    async getFilPricePoints () {
      if (this.ids) {
        const MyGlobalApi = new GlobalApi()
        MyGlobalApi.setRpc(this.rpc)
        MyGlobalApi.setNetworkType(this.networkType)
        const res = await MyGlobalApi.getPrice(this.ids)
        const { usd } = res
        this.priceCurrency = usd
      }
    },
    wallet () {
      window.location.href = './wallet.html'
    },
    formDataChange (obj) {
      const { key, value } = obj
      this.$set(this.formData, key, value)
    },
    check () {
      const gasTimes = bigNumbers(this.formData.gasFeeCap).multipliedBy(this.formData.gasLimit)
      const gas = gasTimes.dividedBy(Math.pow(10, 9))
      const value = bigNumbers(this.formData.value)
      const valueAndGas = value.plus(gas)
      if (valueAndGas.isGreaterThan(this.formData.balance)) {
        return false
      } else {
        return true
      }
    },
    async confirm () {
      const volid = this.check()
      if (volid) {
        this.passwordVisable = true
      } else {
        this.$message.error(this.$t('sendFil.insufficientBalance'))
      }
    },
    cancel () {
      // eslint-disable-next-line no-undef
      popupWindowRemove()
    }
  }
}
</script>
<style  lang="less" scoped>
.custom-send-transaction {
  height: 100%;
  .layout-compontent{
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
    box-sizing: border-box;
  }
  .network{
    padding: 20px;
    text-align: center;
    position: relative;
    font-size: 14px;
    color: #101010;
  }
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
        z-index: 99999;
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
  .from-to {
    display: flex;
    align-items: center;
    justify-content: center;
    padding:0 20px 20px;
    border-bottom: 1px solid #e2e2e2;
    .from,
    .to {
      flex-grow: 1;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: #f5f5f5;
      border-radius: 5px;
      font-size: 14px;
      color: #101010;
    }
    .l {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      border-radius: 12px;
      background: #737171;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 5px;
      i {
        font-size: 14px;
        color: #fff;
        font-weight: bolder;
      }
    }
  }
  .info{
    padding: 20px;
    font-size: 14px;
    color: #101010;
    .origin{
      margin-bottom: 10px;
    }
    .label{
      width:180px;
      height: 30px;
      line-height: 30px;
      border:1px solid #e2e2e2;
      border-radius: 15px;
      text-align: center;
      background: #fff;
      margin-bottom: 20px;
    }
    .amount{
      display: flex;
      align-items: center;
      .logo{
        padding-right: 10px;
      }
    }
  }
  .tabs{
    padding:12px 20px;
    display: flex;
    border-top:1px solid #e2e2e2;
    border-bottom:1px solid #e2e2e2;
    margin-bottom: 20px;
    .tab{
      width: 50px;
      text-align: center;
      cursor: pointer;
      &.active{
        position: relative;
        color: #5CC1CB;
        &:after{
          content: '';
          position: absolute;
          left: 0;
          bottom: -13px;
          height: 2px;
          width: 100%;
          background: #5CC1CB;
        }
      }
    }
  }
  .detail-component{
    flex-grow: 1;
  }
  .button-group{
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /deep/.button-wrap{
      width: 155px;
    }
  }
}
</style>
