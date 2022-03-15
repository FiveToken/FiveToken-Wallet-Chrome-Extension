<template>
  <div class="service-fee-component" v-if="serviceGas">
    <div class="gas-item" v-if="serviceGas.rpcType === 'ethereumMain'">
      <div class="label">
        Max priority fee(Gwei)
        <div class="question">
          <el-popover
            placement="bottom"
            width="200"
            trigger="click"
            :content="$t('sendFil.maxPriorityFeeTips')"
          >
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </div>
      </div>
      <ky-input
        :value="maxPriorityFeePerGas"
        @keydown.native="channelInputLimit"
        @changeInput="maxPriorityFeePerGasChange"
        type="number"
      ></ky-input>
    </div>
    <div class="gas-item" v-if="serviceGas.rpcType === 'ethereumMain'">
      <div class="label">
        Max fee(Gwei)
        <div class="question">
          <el-popover
            placement="bottom"
            width="200"
            trigger="click"
            :content="$t('sendFil.maxFeeTips')"
          >
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </div>
      </div>
      <ky-input
        :value="maxFeePerGas"
        @keydown.native="channelInputLimit"
        @changeInput="maxFeePerGasChange"
        type="number"
      ></ky-input>
    </div>
    <div class="gas-item" v-if="serviceGas.rpcType === 'filecoin'">
      <div class="label">
        GasFeeCap(nanoFil)
        <div class="question">
          <el-popover
            placement="bottom"
            width="200"
            trigger="click"
            :content="$t('sendFil.gasFeeCapTips')"
          >
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </div>
      </div>
      <ky-input
        :value="gasFeeCap"
        @keydown.native="channelInputLimit"
        @changeInput="gasFeeCapChange"
        type="number"
      ></ky-input>
    </div>
    <div class="gas-item"  v-if="serviceGas.rpcType === 'filecoin'">
      <div class="label">
        GasPremium(nanoFil)
        <div class="question">
          <el-popover
            placement="bottom"
            width="200"
            trigger="click"
            :content="$t('sendFil.gasPremiumTips')"
          >
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </div>
      </div>
      <ky-input
        :value="gasPremium"
        @keydown.native="channelInputLimit"
        @changeInput="gasPremiumChange"
        type="number"
      ></ky-input>
    </div>
    <div class="gas-item" v-if="serviceGas.rpcType === 'ethereumOthers'">
      <div class="label">
        GasPrice(Gwei)
        <div class="question">
          <el-popover
            placement="bottom"
            width="200"
            trigger="click"
            :content="$t('sendFil.gasPriceTips') + ' ' + symbol"
          >
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </div>
      </div>
      <ky-input
        :value="gasPrice"
        @keydown.native="channelInputLimit"
        @changeInput="gasPriceChange"
        type="number"
      ></ky-input>
    </div>
    <div class="gas-item">
      <div class="label">
        GasLimit
        <div class="question">
          <el-popover
            placement="bottom"
            width="200"
            trigger="click"
            :content="gasLimitTips"
          >
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </div>
      </div>
      <ky-input
        :value="gasLimit"
        @keydown.native="channelInputLimit"
        @changeInput="gasLimitChange"
        type="number"
      ></ky-input>
      <div class="tips" v-if="serviceGas.gasLimit < 21000">
        {{ $t("sendFil.gasLimitError") }}
      </div>
    </div>
  </div>
</template>
<script>
import { bigNumbers, isFilecoinChain } from '@/utils'
import { mapMutations, mapState } from 'vuex'
import { enumerateNetworkType } from '@/utils/enumeration.js'
export default {
  computed: {
    ...mapState('app', [
      'networkType',
      'symbol',
      'activeNetwork'
    ]),
    ...mapState('send-fil', ['serviceGas']),
    gasLimitTips () {
      let result = ''
      if (this.serviceGas?.rpcType === enumerateNetworkType.ethereumMain) {
        result = this.$t('sendFil.ethereumMainGasLimitTips')
      } else if (this.serviceGas?.rpcType === enumerateNetworkType.ethereumOthers) {
        result = this.$t('sendFil.ethereumOthersGasLimitTips')
      } else {
        result = this.$t('sendFil.filecoinGasLimitTips')
      }
      return result
    }
  },
  data () {
    return {
      gasPrice: 0,
      maxPriorityFeePerGas: 0,
      maxFeePerGas: 0,
      gasLimit: 0,
      gasPremium: 0,
      gasFeeCap: 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initServiceFee()
    })
  },
  methods: {
    ...mapMutations('send-fil', [
      'SET_SERVICEGAS'
    ]),
    initServiceFee () {
      this.gasPrice = this.getKeyValue('gasPrice')
      this.maxPriorityFeePerGas = this.getKeyValue('maxPriorityFeePerGas')
      this.maxFeePerGas = this.getKeyValue('maxFeePerGas')
      this.gasPremium = this.getKeyValue('gasPremium')
      this.gasFeeCap = this.getKeyValue('gasFeeCap')
      this.gasLimit = this.getKeyValue('gasLimit')
    },
    maxPriorityFeePerGasChange (value) {
      this.maxPriorityFeePerGas = this.formatValue(value)
      this.updateServiceFee()
    },
    maxFeePerGasChange (value) {
      this.maxFeePerGas = this.formatValue(value)
      this.updateServiceFee()
    },
    gasFeeCapChange (value) {
      this.gasFeeCap = this.formatValue(value)
      this.updateServiceFee()
    },
    gasPremiumChange (value) {
      this.gasPremium = this.formatValue(value)
      this.updateServiceFee()
    },
    gasPriceChange (value) {
      this.gasPrice = this.formatValue(value)
      this.updateServiceFee()
    },
    gasLimitChange (value) {
      this.gasLimit = this.formatValue(value)
      this.updateServiceFee()
    },
    formatValue (value) {
      const _big = bigNumbers(value)
      const limit = _big.decimalPlaces(9)
      const _value = limit.toFixed()
      return _value
    },
    updateServiceFee () {
      let rpcType = ''
      const chainID = this.activeNetwork.chainID
      if (isFilecoinChain(this.networkType)) {
        rpcType = 'filecoin'
      } else {
        if (chainID === '1') {
          rpcType = 'ethereumMain'
        } else {
          rpcType = 'ethereumOthers'
        }
      }
      const util = Math.pow(10, 9)
      const _maxPriorityFeePerGas = (bigNumbers(this.maxPriorityFeePerGas).multipliedBy(util)).toFixed()
      const _maxFeePerGas = (bigNumbers(this.maxFeePerGas).multipliedBy(util)).toFixed()
      const _gasFeeCap = (bigNumbers(this.gasFeeCap).multipliedBy(util)).toFixed()
      const _gasPremium = (bigNumbers(this.gasPremium).multipliedBy(util)).toFixed()
      const _gasPrice = (bigNumbers(this.gasPrice).multipliedBy(util)).toFixed()

      this.SET_SERVICEGAS({
        rpcType,
        maxPriorityFeePerGas: Number(_maxPriorityFeePerGas),
        maxFeePerGas: Number(_maxFeePerGas),
        gasFeeCap: Number(_gasFeeCap),
        gasPremium: Number(_gasPremium),
        gasPrice: Number(_gasPrice),
        gasLimit: Number(this.gasLimit)
      })
    },
    getKeyValue (key) {
      if (this.serviceGas) {
        const big = bigNumbers(this.serviceGas[key])
        if (key === 'gasLimit') {
          const decimal = big.decimalPlaces(9)
          return decimal.toNumber()
        } else {
          const div = big.div(Math.pow(10, 9))
          const decimal = div.decimalPlaces(9)
          return decimal.toNumber()
        }
      } else {
        return 0
      }
    },
    // input Limit
    channelInputLimit (e) {
      const key = e.key
      if (key === 'e' || key === 'E') {
        e.returnValue = false
        return false
      }
      return true
    }
  }
}
</script>

<style lang="less" scoped>
.service-fee-component {
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  .gas-item {
    margin-bottom: 10px;
    .label {
      font-size: 12px;
      color: #101010;
      line-height: 20px;
      margin-bottom: 3px;
      position: relative;
      .question {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        color: #5bc1ca;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
      }
    }
    .tips {
      font-size: 12px;
      color: #1c818a;
      line-height: 20px;
      padding-top: 3px;
    }
  }
}
</style>
