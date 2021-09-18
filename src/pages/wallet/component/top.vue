<template>
<div class="top-components">
    <div class="top">
        <div class="center">
            <div class="account">{{ accountName | nameFormat }}</div>
            <div class="copy-row">
                <div  class="address">
                    {{ address | addressFormat }}
                </div>
                <div class="copy-icon copy-address-box1"
                    @click="copyAddress1"
                    :data-clipboard-text="address"
                >
                    <i class="el-icon-document-copy"></i>
                </div>
                <div class="more-icon" @click="walletMenu">
                    <i class="el-icon-more"></i>
                </div>
                <div class="wallet-menu" :class="{active:walletMenuVisable}">
                    <div
                        class="menu-item"
                        v-for="(item,index) in $t('wallet.menu')"
                        :key="index"
                        @click="menuClick(item)"
                    >{{item.name}}</div>
                </div>
            </div>

        </div>
    </div>
    <div class="middle">
        <div class="fil">{{balance |formatBalance(4,that)}} {{symbol}}</div>
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
    </div>
</div>
</template>

<script>
import ClipboardJS from 'clipboard'
import { isFilecoinChain, formatNumber } from '@/utils'
import { mapMutations, mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'
import { openUrl } from '@/pages/popup/index.js'
export default {
  data () {
    return {
      that: this,
      addressName: '',
      walletMenuVisable: false,
      logo: require('@/assets/image/logo.png'),
      rec: require('@/assets/image/rec.png'),
      send: require('@/assets/image/send.png')
    }
  },
  props: {
    balance: Number,
    mask: Boolean
  },
  filters: {
    addressFormat (val) {
      if (val.length > 16) {
        return val.substr(0, 8) + '...' + val.substr(val.length - 8, 8)
      } else {
        return val
      }
    },
    formatBalance (val, n, that) {
      if (that.decimals) {
        const dec = val / Math.pow(10, Number(that.decimals))
        const big = new BigNumber(dec).toFixed()
        const num = formatNumber(big, n)
        return num
      } else {
        return 0
      }
    },
    nameFormat (val) {
      if (val.length > 8) {
        return val.substring(0, 8) + '...'
      } else {
        return val
      }
    }
  },
  computed: {
    ...mapState('app', [
      'rpc',
      'address',
      'symbol',
      'accountName',
      'browser',
      'networkType',
      'decimals'
    ])
  },
  mounted () {
    this.handle()
  },
  methods: {
    ...mapMutations('app', [
      'SET_ACCOUNTNAME'
    ]),
    walletMenu () {
      this.walletMenuVisable = !this.walletMenuVisable
    },
    handle () {
      const that = this
      document.addEventListener('click', function (e) {
        if (e.target.parentNode && e.target.parentNode.className !== 'more-icon') {
          that.walletMenuVisable = false
        }
      })
    },
    menuClick (item) {
      const action = item.action
      switch (action) {
        case 'editName':
          this.walletMenuVisable = false
          this.$emit('update:editNameVisable', true)
          break
        case 'viewInBrowser':
          this.walletMenuVisable = false
          this.viewInBrowser()
          break
        case 'backupPrivateKey':
          this.walletMenuVisable = false
          window.location.href = './setting-backups.html?backups=privateKey'
          break
        case 'deleteWallet':
          this.walletMenuVisable = false
          this.$emit('update:deleteUserVisible', true)
          break
      }
    },
    viewInBrowser () {
      if (this.browser) {
        let url = ''
        if (isFilecoinChain(this.networkType)) {
          url = this.browser + `/tipset/address-detail?address=${this.address}`
          openUrl(url)
        } else {
          url = this.browser + `/address/${this.address}`
          openUrl(url)
        }
      } else {
        this.$message.error(this.$t('wallet.noBrowser'))
      }
    },
    sendFil () {
      window.location.href = './send-fil.html'
    },
    openReceive () {
      this.$emit('update:receiveVisible', true)
    },
    copyAddress1 () {
      const that = this
      this.$emit('update:mask', true)
      const clipboard = new ClipboardJS('.copy-address-box1')
      clipboard.on('success', function (e) {
        that.$message({
          type: 'success',
          message: that.$t('wallet.copySuccess'),
          duration: 1000,
          onClose: () => {
            that.$emit('update:mask', false)
          }
        })
      })
      clipboard.on('error', function (e) {})
    }
  }
}
</script>
<style lang="less" scoped>
.top-components{
     .top{
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        text-align: center;
        border-bottom:1px solid #eee;
        padding:10px 0;
        .position{
            position: absolute;
            top: 50%;
            right:10px;
            transform: translateY(-50%) rotate(90deg);
            font-size: 14px;
            color: #222;
        }
        .center{
            font-size: 14px;
            color: #666;
            .account{
                font-size: 14px;
                color: #222;
                font-weight: bolder;
                margin-bottom: 8px;
            }
            .copy-row{
                position: relative;
                display: flex;
                align-items: center;
                background: #f2f2f2;
                padding: 5px 10px;
                border-radius: 5px;
                .address{
                    border-radius: 5px;
                    color: #999;
                    font-size: 14px;
                }
                .copy-icon{
                    padding: 0 10px;
                    cursor: pointer;
                    color: #999;
                    font-size: 14px;
                }
                .more-icon{
                    padding: 0;
                    transform: rotate(90deg);
                    cursor: pointer;
                    color: #999;
                    font-size: 14px;
                }
                .copy-title{
                    position: absolute;
                    top: calc(100% + 10px);
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 3px 10px;
                    background: rgba(0,0,0,0.8);
                    color: #fff;
                    border-radius: 5px;
                    text-align: center;
                    white-space:nowrap;
                    &::after{
                        content: '';
                        width: 0;
                        height: 0;
                        border: 8px solid;
                        border-color: transparent transparent rgba(0,0,0,0.8);
                        position: absolute;
                        bottom: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                }
                .wallet-menu{
                    width: 100%;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background: #fff;
                    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
                    border-radius: 5px;
                    z-index: 999;
                    max-height: 0;
                    transition: all 0.5s;
                    overflow: hidden;
                    &.active{
                        max-height: 205px;
                    }
                    .menu-item{
                        font-size: 14px;
                        color: #101010;
                        padding: 0 10px;
                        height: 50px;
                        line-height: 50px;
                        border-bottom: 1px solid #E6F0F0;
                        text-align: left;
                        cursor: pointer;
                    }
                }
            }
        }
    }
    .middle{
        padding: 15px 0 10px;
        .fil{
            text-align: center;
            font-size: 28px;
            font-weight: bolder;
            color: #222;
            padding: 0 10px;
            word-break: break-all;
        }
        .action{
            padding-top: 15px;
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
    }
}
</style>
