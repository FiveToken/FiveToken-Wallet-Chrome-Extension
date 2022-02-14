<template>
  <div class="step-one">
    <div class="logo">
      <img class="img" :src="logo" />
    </div>
    <div class="www">{{ origin }}</div>
    <div class="title">{{$t('fiveTokenContent.title')}}</div>
    <div class="select-title">{{$t('fiveTokenContent.selectAccount')}}</div>
    <div class="all-new">
      <div class="all">
        <el-checkbox v-model="all" @change="allChange">{{$t('fiveTokenContent.allSelect')}}</el-checkbox>
      </div>
      <div class="new" @click="add">{{$t('fiveTokenContent.newAccount')}}</div>
    </div>
    <div class="select-address" v-if="accountList.length">
      <el-checkbox-group v-model="checkList" @change="groupChange">
        <el-checkbox
          v-for="(item, index) in accountList"
          :key="index"
          :label="item.address"
        >
          <div class="checkbox-item">
            <div class="name-address">
              <div class="name">{{ item.accountName }}</div>
              <div class="address">{{ item.address | formatAddress }}</div>
            </div>
            <div class="balance">{{ item.fil | formatBalance(decimals)}} {{symbol}}</div>
          </div>
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="btn-wrap" v-if="accountList.length">
      <ky-button @btnClick="cancel">{{ $t("fiveTokenContent.cancel") }}</ky-button>
      <ky-button type="primary" :active="active" @btnClick="next">{{$t('fiveTokenContent.next')}}</ky-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatNumber } from '@/utils'
import { BigNumber } from 'bignumber.js'
import { popupWindowRemove } from '@/popup.js'
export default {
  props: {
    origin: String,
    accountList: Array
  },
  data () {
    return {
      logo: require('@/assets/image/logo.png'),
      checkList: [],
      all: false
    }
  },
  computed: {
    ...mapState('app', [
      'symbol',
      'decimals'
    ]),
    active () {
      return this.checkList.length > 0
    }
  },
  filters: {
    formatBalance (val, decimals) {
      if (decimals) {
        const dec = val / Math.pow(10, Number(decimals))
        const big = new BigNumber(dec).toFixed()
        const num = formatNumber(big, 8)
        return num
      } else {
        return 0
      }
    },
    formatAddress (address) {
      if (address.length > 12) {
        const str =
          address.substr(0, 6) + '...' + address.substr(address.length - 6, 6)
        return str
      } else {
        return address
      }
    }
  },
  methods: {
    cancel () {
      // eslint-disable-next-line no-undef
      popupWindowRemove()
    },
    add () {
      this.$emit('addAccount')
    },
    allChange () {
      const allAccountList = this.accountList.map(n => n.address)
      if (this.all) {
        this.checkList = allAccountList
      } else {
        this.checkList = []
      }
    },
    async next () {
      if (this.checkList.length) {
        this.$emit('next', this.checkList)
      }
    },
    groupChange (e) {
      const allAccountList = this.accountList.map(n => n.address)
      const all = allAccountList.every(n => {
        return this.checkList.includes(n)
      })
      if (all) {
        this.all = true
      } else {
        this.all = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.step-one {
  .logo{
    width: 80px;
    height: 80px;
    margin: 0 auto;
    padding:50px 0 10px;
    .img{
      width:80px;
      height: 80px;
    }
  }
  .www{
    font-size: 14px;
    color: #222;
    text-align: center;
    margin-bottom: 20px;
  }
  .title{
    font-size: 24px;
    color: #222;
    font-weight: bolder;
    margin-bottom: 10px;
    text-align: center;
  }
  .select-title{
    font-size: 14px;
    color: #999;
    text-align: center;
    margin-bottom: 20px;
  }
  .all-new{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
    /deep/.el-checkbox{
      &.is-checked{
        .el-checkbox__label{
          color: #606266 !important;
        }
      }
    }
    .new{
      cursor: pointer;
    }
  }
  .new-account{
    font-size: 14px;
    margin-bottom: 20px;
    color: #5CC1CB;
    text-align: right;
    cursor: pointer;
  }
  .select-address{
    margin-bottom: 20px;
    border:1px solid #eee;
    border-radius: 5px;
    padding: 20px;
    height: 160px;
    overflow: auto;
    /deep/.el-checkbox{
      margin: 0 0 20px 0;
      display: flex;
      align-items: center;
      border-bottom:1px solid #e2e2e2;
      .el-checkbox__input{
        &.is-focus{
          .el-checkbox__inner{
            border: 1px solid #DCDFE6;
          }
        }
        .el-checkbox__inner{
          width: 18px;
          height: 18px;
          &::after{
            top:3px;
            left: 6px;
          }
        }
      }
      .el-checkbox__label{
        .checkbox-item{
          padding-bottom: 10px;
          .name-address{
            display: flex;
            align-items: center;
            margin-bottom: 3px;
            font-size: 14px;
            color: #222;
            line-height: 17px;
            .address{
              padding-left: 10px;
            }
          }
          .balance{
            font-size: 12px;
            line-height: 14px;
            color: #999;
          }
        }
      }
    }
  }
  .btn-wrap{
    display: flex;
    justify-content: space-between;
    align-items: center;
    /deep/.button-wrap{
      width: 155px;
    }
  }
}
</style>
