<template>
  <div class="custom-send-transaction">
    <layout @layoutMounted="layoutMounted">
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
        :price_currency="price_currency"
        :baseLimit="baseLimit"
        :baseFeeCap="baseFeeCap"
        @formDataChange="formDataChange"
      />
      <div class="button-group">
        <kyButton @btnClick="cancel">
          {{$t('customSendTransaction.cancel')}}
        </kyButton>
        <kyButton :type="'primary'" :active="active" @btnClick="confirm">
          {{$t('customSendTransaction.confirm')}}
        </kyButton
        >
      </div>
      <div class="loading" v-if="isFetch">
        <img :src="loading" alt="" class="img">
      </div>
    </layout>
  </div>
</template>

<script>
import layout from '@/components/layout'
import kyButton from '@/components/button'
import componentDeatil from './detail.vue'
import { mapState } from 'vuex'
import { GlobalApi } from '@/api'
import { Database } from '@/utils/database.js'
import { getDecodePrivateKey, getGlobalKek, bigNumbers } from '@/utils'
export default {
  data () {
    return {
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
      price_currency: 0,
      baseLimit: 0,
      baseFeeCap: 0,
      db: null
    }
  },
  components: {
    layout,
    kyButton,
    componentDeatil
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
    console.log(this.formData, 'this.formData')
    this.baseLimit = this.formData.gasLimit || 0
    this.baseFeeCap = this.formData.gasFeeCap || 0
    this.db = new Database()
  },
  methods: {
    async layoutMounted () {
      const kek = getGlobalKek()
      this.pkk = getDecodePrivateKey(this.privateKey, kek, this.networkType)
      this.getFilPricePoints()
    },
    // get exchange rate
    async getFilPricePoints () {
      if (this.ids) {
        const MyGlobalApi = new GlobalApi()
        MyGlobalApi.setRpc(this.rpc)
        MyGlobalApi.setNetworkType(this.networkType)
        const res = await MyGlobalApi.getPrice(this.ids)
        const { usd } = res
        this.price_currency = usd
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
        this.isFetch = true
        try {
          const gasFeeCap = bigNumbers(this.formData.gasFeeCap)
          const tx = {
            from: this.formData.address,
            to: this.formData.to,
            value: this.formData.value,
            privateKey: this.pkk,
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
          if (result && result.signed_cid) {
            // eslint-disable-next-line camelcase
            const create_time = parseInt(new Date().getTime() / 1000)
            const gasTimes = bigNumbers(this.formData.gasFeeCap).multipliedBy(this.formData.gasLimit)
            const allGasFee = gasTimes.multipliedBy(Math.pow(10, 9)).toNumber()
            const _value = bigNumbers(this.formData.value).multipliedBy(Math.pow(10, 18)).toNumber()
            await this.db.addTable('messageList', {
              signed_cid: result.signed_cid,
              from: this.formData.address,
              to: this.formData.to,
              create_time,
              block_time: 0,
              nonce: result.nonce,
              allGasFee: allGasFee,
              decimals: '18',
              token: 'FIL',
              type: 'pending',
              khazix: 'khazix',
              value: _value,
              rpc: this.rpc
            })
            await this.db.deleteTable('addressRecordLast', {
              address: this.formData.to,
              rpc: this.rpc
            })
            await this.db.addTable('addressRecordLast', {
              address: this.formData.to,
              create_time,
              rpc: this.rpc,
              khazix: 'khazix'
            })

            // eslint-disable-next-line no-undef
            popupToBackground('fil_sendTransaction', { cid: result.signed_cid })
            // eslint-disable-next-line no-undef
            popupWindowRemove()
          }
          this.isFetch = false
        } catch (error) {
          console.log(error, 'error 1')
          this.isFetch = false
        }
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
  .button-group{
    padding:100px 20px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /deep/.button-wrap{
      width: 155px;
    }
  }
}
</style>
