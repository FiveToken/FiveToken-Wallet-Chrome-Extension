<template>
    <div class="transaction-item-components" >
        <div class="block-time">
            {{time}}
        </div>
        <div class="info-wrap">
            <div class="icon send" v-if="item.type === 'success' && item.from === address">
                <img class="img" :src="rec" />
            </div>
            <div class="icon reveiced" v-else-if="item.type === 'success' && item.to === address">
                <img class="img" :src="send" />
            </div>
            <div class="icon pending" v-if="item.type === 'pending'">
                <img class="img" :src="pending" />
            </div>
            <div class="icon error" v-if="item.type === 'error'">
                <img class="img" :src="error" />
            </div>
            <div class="name-status">
                <div class="name">
                    {{address === item.from? $t('wallet.send'):$t('wallet.received')}}
                </div>
                <div class="status">
                    {{ item.type | formatStatusName(that) }}
                </div>

            </div>
            <div class="fil-address">
                <div class="fil">
                    {{ item.value | formatBalance(8,item.decimals) }}
                    {{ item.token }}
                </div>
                <div class="address">
                    {{ address === item.from ? $t('wallet.labelReceived'):$t('wallet.labelSend') }}:
                    {{ address | addressFormat(item.from,item.to) }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { formatNumber, formatDate, minimumPrecision } from '@/utils'
import { BigNumber } from 'bignumber.js'
export default {
  data () {
    return {
      that: this,
      rec: require('@/assets/image/rec.png'),
      send: require('@/assets/image/send.png'),
      pending: require('@/assets/image/pending.png'),
      error: require('@/assets/image/fail.png')
    }
  },
  filters: {
    addressFormat (address, from, to) {
      if (address === from) {
        if (to.length > 12) {
          return to.substr(0, 6) + '...' + to.substr(to.length - 6, 6)
        } else {
          return to
        }
      } else {
        if (from.length > 12) {
          return from.substr(0, 6) + '...' + from.substr(from.length - 6, 6)
        } else {
          return from
        }
      }
    },
    formatBalance (val, n, decimals) {
      const dec = val / Math.pow(10, Number(decimals))
      const big = new BigNumber(dec).toFixed()
      if (dec !== 0 && dec < minimumPrecision) {
        const min = new BigNumber(minimumPrecision).toFixed()
        return '<' + min
      } else {
        const num = formatNumber(big, n)
        return num
      }
    },
    formatStatusName (type, that) {
      let name = ''
      switch (type) {
        case 'success':
          name = that.$t('wallet.statusSuccess')
          break
        case 'error':
          name = that.$t('wallet.statusError')
          break
        case 'pending':
          name = that.$t('wallet.statusPending')
          break
      }
      return name
    }
  },
  props: {
    item: Object
  },
  computed: {
    ...mapState('app', ['address']),
    time () {
      let t = ''
      if (this.item) {
        if (this.item.type === 'pending') {
          t = formatDate(this.item.create_time, true)
        } else {
          t = this.item.block_time
        }
      }
      return t
    }
  },
  methods: {
    skipToToken (item) {
      this.$emit('tokenShow', item)
    },
    refreshList () {

    },
    selectType (type) {
      this.type = type
    },
    // eslint-disable-next-line camelcase
    showDetail (signed_cid, obj) {
      console.log(signed_cid, obj, 'signed_cid,obj')
      this.$emit('openDetail', signed_cid, obj)
    }
  }
}
</script>

<style lang="less" scoped>
.transaction-item-components{
    padding: 5px 20px 15px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    .info-wrap{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .block-time{
        color: #999;
        font-size: 12px;
        margin-bottom: 10px;
    }
    .icon{
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        &.reveiced{
            background: #5CC1CB;
        }
        &.send{
            background: #5C8BCB;
        }
        &.pending{
            background: #E8CC5C;
        }
        &.error{
            background: #B4B5B7;
        }
        .img{
            width:22px;
            height: 22px;
        }
    }
    .name-status{
        padding-left: 15px;
        .name{
            font-size: 14px;
            color: #101010;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .status{
            font-size: 12px;
            color: #999;
        }
    }
    .fil-address{
        flex-grow: 1;
        text-align: right;
        padding-left: 10px;
        .fil{
            font-size: 14px;
            color: #222;
            margin-bottom: 5px;
        }
        .address{
            font-size: 12px;
            color: #999;
        }
    }
}
</style>
