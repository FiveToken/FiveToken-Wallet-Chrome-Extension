<template>
  <div class="detail-component">
    <div class="service-fee">
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            <div class="fee-title">
              <div class="label">{{ $t("sendFil.maxGas") }}</div>
              <div class="amount">
                <div class="token">
                  {{ allGasFee | formatGas(8) }} {{ symbol }}
                </div>
                <div class="usd">
                  $ {{ allGasFee | formatUSD(8, priceCurrency) }}
                </div>
              </div>
            </div>
          </template>
          <div class="fee-detail" v-if="serviceGas">
            <service-fee></service-fee>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="total">
      <div class="total-tips">{{$t('sendFil.totalTips')}}</div>
      <div class="row">
        <div class="label">{{$t('sendFil.total')}}</div>
        <div class="value">{{ total }} {{formData.symbol}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatNumber, bigNumbers, isFilecoinChain } from '@/utils'
import { BigNumber } from 'bignumber.js'
import serviceFee from '@/pages/send-fil/component/service-fee.vue'
export default {
  components: {
    serviceFee
  },
  props: {
    formData: Object,
    priceCurrency: Number
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapState('app', ['networkType', 'symbol']),
    ...mapState('send-fil', ['serviceGas']),
    allGasFee () {
      const gasTimes = bigNumbers(this.formData.gasFeeCap).multipliedBy(
        this.formData.gasLimit
      )
      const gas = gasTimes.dividedBy(Math.pow(10, 18)).toString()
      return gas
    },
    gasUnit () {
      let unit = ''
      if (isFilecoinChain(this.networkType)) {
        unit = 'nanoFIL'
      } else {
        unit = 'GWEI'
      }
      return unit
    },
    total () {
      const value = bigNumbers(this.formData.value)
      const total = value.plus(this.allGasFee).toString()
      const big = bigNumbers(total)
      const str = big.toFixed()
      const t = formatNumber(str, 12)
      return t
    },
    active () {
      return this.formData.gasFeeCap !== '' && this.formData.gasLimit !== ''
    },
    baseFeeTips () {
      let str = ''
      if (isFilecoinChain(this.networkType)) {
        str = this.$t('sendFil.filBaseFeeTips')
      } else {
        str = this.$t('sendFil.baseFeeTips')
      }
      return str + this.symbol
    }
  },
  filters: {
    formatFil (val) {
      const big = new BigNumber(val)
      const str = big.toFixed()
      const num = formatNumber(str, 12)
      return num
    },
    formatGas (val, n) {
      const big = new BigNumber(val)
      const str = big.toFixed()
      const num = formatNumber(str, n)
      return num
    },
    formatUSD (val, n, priceCurrency) {
      const usd = val * priceCurrency
      const big = new BigNumber(usd)
      const str = big.toFixed()
      const num = formatNumber(str, n)
      return num
    }
  },
  methods: {
    gasLimitChange (val) {
      this.$emit('formDataChange', {
        key: 'gasLimit',
        value: val
      })
    },
    gasFeeCapChange (val) {
      this.$emit('formDataChange', {
        key: 'gasFeeCap',
        value: val
      })
    },
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
<style  lang="less" scoped>
.detail-component {
  .service-fee {
    padding: 0 15px;
    display: flex;
    align-items: center;
    /deep/.el-collapse {
      width: 100%;
      border: none;
      padding: 15px 0;
      background: #dcf9f9;
      border-radius: 10px;
      .el-collapse-item {
        .el-collapse-item__header {
          background: transparent;
          border: none;
          font-weight: normal;
        }
        .el-collapse-item__content {
          padding-bottom: 0;
        }
        .el-collapse-item__wrap {
          border-bottom: none;
          background: transparent;
        }
        .fee-title {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
          box-sizing: border-box;
          font-size: 14px;
          color: #101010;
          .amount {
            line-height: 20px;
            .usd {
              text-align: right;
            }
          }
        }
        .fee-detail {
          padding: 10px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          box-sizing: border-box;
          .gasfee,
          .gaslimit {
            flex: 0 0 47%;
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
      }
    }
  }
  .total {
    padding: 15px;
    font-size: 14px;
    color: #101010;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .row {
      text-align: right;
      .label{
        margin-bottom: 5px;
      }
    }
  }
}
</style>
