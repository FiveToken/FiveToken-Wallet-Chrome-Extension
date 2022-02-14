<template>
  <div class="list-wrap">
    <div class="tab">
      <div
        class="tab-item"
        v-for="(item, index) in $t('wallet.tab')"
        :key="index"
        :class="{ active: type === item.type }"
        @click="selectType(item.type)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="list">
      <div class="list-property-wrap" v-if="type === '1'">
        <div class="list-property">
          <div
            class="list-item"
            @click="skipToToken(symbol, decimals, balance, 1)"
          >
            <div class="logo" v-if="activeNetwork">
              <div class="img-wrap" v-if="owenChain">
                <img class="img" :src="require(`@/assets/svg/${chainImg}`)" />
              </div>
              <div class="custom-img" v-else>
                {{ chainName.substring(0, 1) }}
              </div>
            </div>
            <div class="fil-amount">
              {{ balance | formatBalance(8, decimals,symbol,onLine) }}
            </div>
            <div class="amount">
              <div class="usd">
                {{ balance | formatUsd(2, decimals, priceCurrency,currency,onLine) }}
              </div>
            </div>
          </div>
          <div
            class="list-item"
            v-for="(item, index) in tokenList"
            :key="index"
            @click="skipToToken(item.symbol, item.decimals, item.balance, 0)"
          >
            <div class="logo">
              <kyCanvas :contract="item.contract" />
            </div>
            <div class="fil-amount">
              {{ item.balance | formatBalance(8, item.decimals,item.symbol,onLine) }}
            </div>
          </div>
        </div>

        <div
          class="add-token"
          v-if="networkType === 'ethereum'"
          @click="addToken"
        >
          <i class="el-icon-plus"></i>
        </div>
      </div>
      <div class="list-activity" v-if="type === '2'">
        <div class="activity-item">
          <div class="activity-wrap">
            <div
              class="item-wrap"
              v-for="(item, index) in sortedMessageList"
              :key="index"
              @click="showDetail(item)"
            >
              <transactionItem :item="item" />
            </div>
          </div>
          <div class="no-data" v-if="!sortedMessageList.length">
            {{ $t("wallet.noTransactionRecord") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import {
  getQueryString,
  formatNumber,
  minimumPrecision
} from '@/utils'
import transactionItem from './transaction-item.vue'
import { BigNumber } from 'bignumber.js'
import kyCanvas from '@/components/token-icon'
export default {
  components: {
    transactionItem,
    kyCanvas
  },
  props: {
    priceCurrency: Number,
    balance: Number
  },
  data () {
    return {
      type: '1'
    }
  },
  filters: {
    addressFormat (val) {
      if (val.length > 12) {
        return val.substr(0, 6) + '...' + val.substr(val.length - 6, 6)
      } else {
        return val
      }
    },
    formatBalance (val, n, decimals, symbol, onLine) {
      if (!onLine) {
        return '---'
      }
      if (decimals) {
        const dec = val / Math.pow(10, Number(decimals))
        const big = new BigNumber(dec)
        const str = big.toFixed()
        if (dec !== 0 && dec < minimumPrecision) {
          const min = new BigNumber(minimumPrecision).toFixed()
          return '<' + min + symbol
        } else {
          const num = formatNumber(str, n)
          return num + ' ' + symbol
        }
      } else {
        return 0
      }
    },
    // eslint-disable-next-line camelcase
    formatUsd (val, n, decimals, priceCurrency, currency, onLine) {
      if (!onLine) {
        return '---'
      }
      if (decimals) {
        const unit = currency === 'cny' ? '¥' : '$'
        const dec = val / Math.pow(10, Number(decimals))
        if (dec < minimumPrecision) {
          return 0
        } else {
          // eslint-disable-next-line camelcase
          const dep = dec * priceCurrency
          const ss = new BigNumber(dep).toFixed()
          const num = formatNumber(ss, n)
          return unit + ' ' + num
        }
      } else {
        return 0
      }
    }
  },
  computed: {
    ...mapState('app', [
      'address',
      'rpc',
      'symbol',
      'networkType',
      'decimals',
      'currency',
      'activeNetwork',
      'onLine'
    ]),
    ...mapState('wallet', [
      'messageList',
      'tokenList'
    ]),
    ...mapGetters('wallet', ['sortedMessageList']),
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
  async mounted () {
    const fromPage = getQueryString('fromPage')
    if (fromPage === 'sendFil' || fromPage === 'messageDetail') {
      this.type = '2'
    }
  },
  methods: {
    skipToToken (symbol, decimals, balance, isMain) {
      this.$emit('tokenShow', { symbol, decimals, balance, isMain })
    },
    async selectType (type) {
      this.type = type
    },
    showDetail (item) {
      const listObj = {
        ...item
      }
      const listObjStr = JSON.stringify(listObj)
      window.location.href = `./message-detail.html?cid=${item.cid}&listObjStr=${listObjStr}`
    },
    addToken () {
      window.location.href = './add-token.html'
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes rotate {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
.list-wrap {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  .tab {
    display: flex;
    .tab-item {
      height: 40px;
      line-height: 40px;
      color: #222;
      text-align: center;
      flex-grow: 1;
      cursor: pointer;
      font-size: 14px;
      &.active {
        color: #5cc1cb;
        position: relative;
        &::after {
          content: "";
          width: 100%;
          height: 2px;
          background: #5cc1cb;
          position: absolute;
          bottom: 0;
          left: 0;
        }
      }
    }
  }
  .list {
    flex-grow: 1;
    .list-property-wrap {
      height: 100%;
      position: relative;
      .add-token {
        position: absolute;
        width: 24px;
        height: 24px;
        border-radius: 12px;
        background: #5cc1cb;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        i {
          font-size: 18px;
          color: #fff;
          font-weight: bold;
          margin-bottom: 3px;
        }
      }
    }
    .list-property {
      height: 235px;
      overflow-y: auto;
      .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        cursor: pointer;
        .logo {
          width: 30px;
          height: 30px;
          border-radius: 15px;
          .img-wrap {
            width: 30px;
            height: 30px;
            .img {
              width: 30px;
              height: 30px;
            }
          }
          .custom-img {
            background: #5cc1cb;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: #fff;
            border-radius: 15px;
            line-height: 30px;
          }
        }
        .amount {
          padding-left: 5px;
          .fil {
            font-size: 16px;
            color: #222;
            font-weight: bolder;
          }
          .usd {
            font-size: 12px;
            color: #999;
          }
        }
        .fil-amount {
          flex-grow: 1;
          padding-left: 10px;
          font-size: 12px;
          color: #131313;
          font-weight: bolder;
        }
      }
    }
    .list-activity {
      .no-data {
        padding: 15px 0;
        font-size: 16px;
        text-align: center;
        color: #c2c2c2;
      }
    }
  }
}
</style>
