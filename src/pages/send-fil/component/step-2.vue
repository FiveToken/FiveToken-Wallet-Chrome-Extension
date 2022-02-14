<template>
  <div class="step-2-component">
    <div class="back-wrap">
      <ky-back
        :name="$t('sendFil.confirmTransaction')"
        @pageBack="back"
      ></ky-back>
    </div>
    <div class="content">
      <div class="send-info">
        <div class="main-logo" v-if="formData.isMain">
          <div class="logo" v-if="activeNetwork.length">
            <div class="img-wrap" v-if="owenChain">
              <img class="img" :src="require(`@/assets/svg/${chainImg}`)" />
            </div>
            <div class="custom-img" v-else>{{ chainName.substring(0, 1) }}</div>
          </div>
        </div>
        <div class="token-logo" v-else>
          <div class="logo">
            <ky-canvas :contract="formData.contract"></ky-canvas>
          </div>
        </div>

        <div class="amount">
          {{ formData.fil | formatValue }} {{ formData.symbol }}
        </div>
        <div class="send-amount">{{ $t("sendFil.sendAmount") }}</div>
        <div class="from-to">
          <div class="from">{{ address | addressFormat }}</div>
          <div class="l">
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="to">{{ formData.to | addressFormat }}</div>
        </div>
      </div>
      <div class="service-fee">
        <el-collapse accordion>
          <el-collapse-item>
            <template slot="title">
              <div class="fee-title">
                <div class="label">{{ $t("sendFil.maxGas") }}</div>
                <div class="amount">
                  <div class="token">
                    {{ formatHandlingFee | formatGas(8, decimals) }} {{ symbol }}
                  </div>
                  <div class="usd">
                    {{ currency === "cny" ? "¥" : "$" }}
                    {{ formatHandlingFee | formatUSD(8, priceCurrency, decimals) }}
                  </div>
                </div>
              </div>
            </template>
            <service-fee></service-fee>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="total" v-if="formData.isMain">
        <div class="total-tips">{{ $t("sendFil.totalTips") }}</div>
        <div class="row">
          <div class="label">{{ $t("sendFil.total") }}</div>
          <div class="value">{{ total }} {{ symbol }}</div>
        </div>
      </div>
    </div>

    <div class="position">
      <div class="btn-wrap">
        <ky-button @btnClick="back">{{ $t("sendFil.cancel") }}</ky-button>
        <ky-button :type="'primary'" @btnClick="send" :active="active">
          {{ $t("sendFil.confirm") }}
        </ky-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import { formatNumber, bigNumbers } from '@/utils'
import serviceFee from './service-fee.vue'
export default {
  components: {
    serviceFee
  },
  props: {
    formData: Object,
    mainBalance: Number,
    priceCurrency: Number
  },
  data () {
    return {
      logo: require('@/assets/image/fil-w.png')
    }
  },
  filters: {
    formatValue (val) {
      const big = bigNumbers(val)
      const str = big.toFixed()
      const num = formatNumber(str, 12)
      return num
    },
    formatGas (val, n, decimals) {
      const big = bigNumbers(val)
      const str = big.toFixed()
      const num = formatNumber(str, n)
      return num
    },
    formatUSD (val, n, priceCurrency, decimals) {
      const usd = val * priceCurrency
      const big = bigNumbers(usd)
      const str = big.toFixed()
      const num = formatNumber(str, n)
      return num
    },
    addressFormat (val) {
      if (val.length > 16) {
        return val.substr(0, 8) + '...' + val.substr(val.length - 8, 8)
      } else {
        return val
      }
    }
  },
  computed: {
    ...mapState('app', [
      'rpc',
      'symbol',
      'address',
      'networkType',
      'currency',
      'activeNetwork',
      'decimals'
    ]),
    ...mapGetters('send-fil', ['handlingFee']),
    formatHandlingFee () {
      const _fee = bigNumbers(this.handlingFee).div(Math.pow(10, this.decimals))
      return _fee.toFixed()
    },
    total () {
      const fil = bigNumbers(this.formData.fil)
      const total = fil.plus(this.formatHandlingFee).toString()
      const big = bigNumbers(total)
      const str = big.toFixed()
      const result = formatNumber(str, 12)
      return result
    },
    active () {
      return this.formData.gasFeeCap !== '' && this.formData.gasLimit !== ''
    },
    owenChain () {
      let volid = false
      if (this.activeNetwork) {
        volid = this.activeNetwork.disabled
      }
      return volid
    },
    chainImg () {
      let src = ''
      if (this.activeNetwork) {
        src = this.activeNetwork.image
      }
      return src
    },
    chainName () {
      let name = ''
      if (this.activeNetwork) {
        name = this.activeNetwork.name
      }
      return name
    }
  },
  methods: {
    back () {
      this.$emit('previousStep')
    },
    send () {
      if (this.active) {
        if (bigNumbers(this.mainBalance).isGreaterThan(this.formatHandlingFee)) {
          if (this.formData.isAll) {
            if (this.formData.isMain === 1) {
              const balance = bigNumbers(this.formData.balance)
              const val = balance.minus(this.formatHandlingFee).toNumber()
              this.$emit('formDataChange', {
                key: 'fil',
                value: val
              })
            } else {
              const val = this.formData.balance
              this.$emit('formDataChange', {
                key: 'fil',
                value: val
              })
            }
          }
          this.$emit('sendSubmit')
        } else {
          this.$message.error(this.$t('sendFil.insufficientBalance'))
        }
      }
    }
  }
}
</script>

<style  lang="less" scoped>
.step-2-component {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .content{
    flex-grow: 1;
    max-height: 480px;
    overflow-y: auto;
  }
  .back-wrap {
    border-bottom: 1px solid #eee;
    padding: 15px;
  }
  .send-info {
    padding: 30px 15px;
    .logo {
      width: 30px;
      height: 30px;
      margin: 0 auto 20px;
      .img {
        width: 30px;
        height: 30px;
      }
    }
    .amount {
      font-size: 20px;
      color: #131313;
      font-weight: bold;
      text-align: center;
      margin-bottom: 2px;
    }
    .send-amount {
      font-size: 14px;
      color: #6a6767;
      text-align: center;
      margin-bottom: 25px;
    }
    .from-to {
      display: flex;
      align-items: center;
      justify-content: center;
      .from,
      .to {
        width: 150px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: #f5f5f5;
        border-radius: 5px;
        font-size: 14px;
        color: #101010;
      }
      .l {
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
  }
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
      }
    }
  }
  .total {
    padding: 15px;
    font-size: 14px;
    color: #101010;
    .total-tips {
      text-align: right;
      margin-bottom: 5px;
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .position {
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 15px;
    border-top: 1px solid #eee;
    width: 100%;
    box-sizing: border-box;
    .btn-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      /deep/.button-wrap {
        width: 155px;
      }
    }
  }
}
</style>
