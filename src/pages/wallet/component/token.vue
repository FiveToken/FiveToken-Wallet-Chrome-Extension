<template>
    <div class="token-components">
        <div class="top-back">
            <kyBack :name="tokenName" @pageBack='closeToken'/>
        </div>
        <div class="logo"></div>
        <div class="balance">{{tokenBalance|formatBalance(tokenDecimals,8)}} {{tokenName}}</div>
        <div class="usd" v-if="tokenIsMain">
            {{ currency === 'cny' ? "¥" : "$"}}
            {{tokenBalance*price_currency | formatBalance(tokenDecimals,2)}}
        </div>
        <div class="action">
            <div class="receive" @click="openReceive">
                <div class="icon">
                    <img class="img" :src="send" />
                </div>
                <div class="text">{{$t('wallet.received')}}</div>
            </div>
            <div class="send" @click="sendFil">
                <div class="icon">
                    <img class="img" :src="rec" />
                </div>
                <div class="text">{{$t('wallet.send')}}</div>
            </div>
        </div>
        <div class="list-tab">{{$t('wallet.tranRecord')}}</div>
        <div class="list" v-if="tokenList.length">
            <div class="item-wrap" v-for="(item,index) in tokenList" :key="index" @click="showDetail(item)">
                <transactionItem :item="item" />
            </div>
        </div>
    </div>
</template>

<script>
import kyBack from '@/components/back'
import { mapState } from 'vuex'
import transactionItem from './transaction-item.vue'
import { formatNumber } from '@/utils'
import { BigNumber } from 'bignumber.js'
export default {
  data () {
    return {
      rec: require('@/assets/image/rec.png'),
      send: require('@/assets/image/send.png')
    }
  },
  computed: {
    ...mapState('app', ['currency'])
  },
  props: {
    tokenIsMain: Number,
    tokenBalance: Number,
    tokenName: String,
    price_currency: Number,
    receiveVisible: Boolean,
    tokenVisible: Boolean,
    symbol: String,
    tokenDecimals: Number,
    tokenList: Array
  },
  filters: {
    formatBalance (val, decimals, n) {
      const dec = val / Math.pow(10, Number(decimals))
      const big = new BigNumber(dec).toFixed()
      const num = formatNumber(big, n)
      return num
    }
  },
  components: {
    kyBack,
    transactionItem
  },
  methods: {
    closeToken () {
      this.$emit('closeToken')
    },
    sendFil () {
      window.location.href = './send-fil.html'
    },
    openReceive () {
      this.$emit('update:receiveVisible', true)
    },
    showDetail (item) {
      const listObj = {
        ...item
      }
      const listObjStr = JSON.stringify(listObj)
      window.location.href = `./message-detail.html?signed_cid=${item.signed_cid}&listObjStr=${listObjStr}`
    }
  }
}
</script>
<style lang="less" scoped>
.token-components{
    .top-back{
        padding: 20px;
        border-bottom: 1px solid #F6F7FF;
        margin-bottom: 20px;
    }
    .logo{

    }
    .balance{
        font-size: 26px;
        color: #131313;
        line-height: 30px;
        text-align: center;
        margin-bottom: 5px;
        font-weight: bold;
    }
    .usd{
        font-size: 16px;
        color: #6A6767;
        line-height: 18px;
        margin-bottom: 15px;
        text-align: center;
    }
    .action{
        display: flex;
        justify-content: center;
        .receive{
            margin-right: 40px;
            .icon{
                background: #5CC1CB;
            }
        }
        .send{
            .icon{
                background: #5C8BCB;
            }
        }
        .receive,.send{
            text-align: center;
            cursor: pointer;
            .icon{
                width: 30px;
                height: 30px;
                border-radius: 15px;
                margin: 0 auto 6px;
                line-height: 30px;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                .img{
                    width: 22px;
                    height: 22px;
                }
            }
            .text{
                font-size: 14px;
                color: #999;

            }
        }
    }
    .list-tab{
        font-size: 14px;
        color: #5CC1CB;
        padding: 10px 0;
        text-align: center;
        border-bottom: 2px solid #5CC1CB;
    }
}
</style>
