<template>
<div class="step-1-component">
    <div class="send-fil-box">
        <div class="back-wrap">
            <ky-back
              :name="$t('sendFil.send')"
              @pageBack="sendBack"
            ></ky-back>
        </div>
        <div class="send-content">
            <div class="input-item">
                <div class="label">
                  {{$t('sendFil.token')}}
                </div>
                <div
                  class="value"
                  @click="tokenVisible = true"
                >
                    <div
                      class="main-logo"
                      v-if="formData.isMain === 1"
                    >
                        <div
                          class="logo"
                          v-if="activeNetwork.length"
                        >
                            <div class="img-wrap" v-if="owenChain">
                                <img
                                  class="img"
                                  :src="require(`@/assets/svg/${chainImg}`)"
                                />
                            </div>
                            <div v-else class="custom-img">
                              {{chainName.substring(0,1)}}
                            </div>
                        </div>
                    </div>
                    <div v-if="formData.isMain === 0" class="token-logo">
                        <div class="logo">
                            <ky-canvas :contract="formData.contract"></ky-canvas>
                        </div>
                    </div>
                    <div class="token">
                      {{formData.symbol}}
                    </div>
                    <div class="name">
                      {{formData.chainName}}
                    </div>
                    <div class="icon">
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>
            </div>
            <div class="input-item">
                <div class="label">
                  {{$t('sendFil.toAddress')}}
                </div>
                <div class="value">
                    <div
                      class="name"
                      v-if="formData.toName"
                    >
                      {{formData.toName.substring(0,8)}}
                    </div>
                    <div class="address">
                        <ky-input
                          :value="formData.to"
                          @changeInput="toChange"
                        ></ky-input>
                    </div>
                    <div class="icon" @click="addressVisible = true">
                        <i class="el-icon-notebook-1"></i>
                    </div>
                </div>
            </div>
            <div class="input-item">
                <div class="label">{{$t('sendFil.number')}}</div>
                <div class="value">
                    <ky-input
                      :value="formData.fil"
                      type="number"
                      @keydown.native="channelInputLimit"
                      @changeInput="filChange"
                    ></ky-input>
                    <div class="all" @click="allFil">{{$t('sendFil.all')}}</div>
                </div>
                <div class="available" v-if="onLine">
                    {{ $t('sendFil.available') }} :
                    {{ formData.balance | formatBalance(12)}}
                    {{ formData.symbol }}
                </div>
                <div class="available" v-else>---</div>
            </div>
        </div>
        <div class="position">
            <div class="btn-wrap">
                <ky-button
                  :type="'primary'"
                  :active="active"
                  @btnClick="next"
                >
                    {{$t('sendFil.send')}}
                </ky-button>
            </div>
        </div>

        <el-dialog
            :visible.sync="tokenVisible"
            width="100%"
            :fullscreen='true'
            :top="'0'"
            :show-close="false"
        >
            <select-token
                @selectToken="selectToken"
                @colseToken="tokenVisible = false"
            >
            </select-token>
        </el-dialog>
        <el-dialog
            :visible.sync="addressVisible"
            width="100%"
            :fullscreen='true'
            :top="'0'"
            :show-close="false"
        >
            <select-address
              @selectAddress="selectAddress"
              @colseAddress="addressVisible = false"
            >
            </select-address>
        </el-dialog>
    </div>
</div>
</template>

<script>
import selectAddress from './select-address.vue'
import selectToken from './select-token.vue'
import { isValidAddress, formatNumber } from '@/utils'
import { mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'
export default {
  components: {
    selectAddress,
    selectToken
  },
  props: {
    formData: Object
  },
  data () {
    return {
      pageType: 'send-fil',
      tokenVisible: false,
      addressVisible: false,
      logo: require('@/assets/image/logo.png'),
      accountList: [],
      addressRecordLast: [],
      addressBook: []
    }
  },
  computed: {
    ...mapState('app', [
      'rpc',
      'symbol',
      'address',
      'networkType',
      'decimals',
      'activeNetwork',
      'onLine'
    ]),
    active () {
      return this.formData.to !== '' && this.formData.fil !== ''
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
  filters: {
    formatBalance (val, n) {
      if (val) {
        const dec = Number(val)
        const big = new BigNumber(dec)
        const str = big.toFixed()
        const num = formatNumber(str, n)
        return num
      } else {
        return 0
      }
    }
  },
  methods: {
    sendBack () {
      window.location.href = './wallet.html'
    },
    selectToken (obj) {
      this.tokenVisible = false
      this.$emit('formDataChange', {
        key: 'token',
        value: obj
      })
    },
    selectAddress (obj) {
      this.addressVisible = false
      const { item, type } = obj
      this.$emit('formDataChange', {
        key: 'to',
        value: item.address,
        accountName: item.accountName,
        type
      })
    },
    toChange (val) {
      this.$emit('formDataChange', {
        key: 'to',
        value: val,
        accountName: '',
        type: 'input'
      })
    },
    channelInputLimit (e) {
      const key = e.key
      if (key === 'e' || key === 'E') {
        e.returnValue = false
        return false
      }
      return true
    },
    filChange (val) {
      this.$emit('formDataChange', { key: 'fil', value: val })
    },
    allFil () {
      this.$emit('formDataChange', { key: 'isAll', value: 1 })
    },
    async next () {
      if (this.active) {
        const to = this.formData.to.toLowerCase()
        const from = this.address.toLowerCase()
        const volid = await isValidAddress(to, this.networkType)
        if (volid) {
          if (from === to) {
            this.$message.error(this.$t('sendFil.sameAddressError'))
          } else {
            this.$emit('next')
          }
        } else {
          this.$message.error(this.$t('sendFil.addressError'))
        }
      }
    }
  }
}
</script>

<style  lang="less" scoped>
.step-1-component{
    height: 100%;
    .send-fil-box{
        height: 100%;
        position: relative;
        .back-wrap{
            padding: 15px;
            border-bottom: 1px solid #F6F7FF;
        }
        .send-content{
            padding: 20px 15px;
            .input-item{
                margin-bottom: 20px;
                .label{
                    font-size: 14px;
                    color: #101010;
                    margin-bottom: 5px;
                    line-height: 20px;
                }
                .value{
                    height: 36px;
                    background: #F5F5F5;
                    border-radius: 5px;
                    display: flex;
                    align-items: center;
                    padding: 0 60px 0 10px;
                    position: relative;
                    cursor: pointer;
                    .logo{
                        width:30px;
                        height: 30px;
                        margin-right: 15px;
                        .img{
                            width:30px;
                            height: 30px;
                        }
                        .custom-img{
                            background: #5CC1CB;
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
                    .token{
                        font-size: 14px;
                        color: #101010;
                        margin-right: 10px;
                    }
                    .name{
                        padding-right: 5px;
                        font-size: 12px;
                        color: #737171;
                    }
                    .address{
                        flex-grow: 1;
                    }
                    .icon{
                        position: absolute;
                        right: 10px;
                        top: 50%;
                        transform: translateY(-50%);
                        cursor: pointer;
                        i{
                            font-size: 18px;
                            color: #201F1F;
                        }
                    }
                    .all{
                        width: 47px;
                        height: 22px;
                        background: #5CC1CB;
                        position: absolute;
                        line-height: 22px;
                        text-align: center;
                        font-size: 12px;
                        color: #101010;
                        border-radius: 5px;
                        right: 10px;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                    /deep/.input-component{
                        flex-grow: 1;
                        .el-input__inner{
                            border: none;
                            padding: 0;
                        }
                    }
                }
                .available{
                    padding-top: 4px;
                    font-size: 14px;
                    color: #6A6767;
                }
            }
        }
        .position{
            width: 100%;
            position: absolute;
            bottom: 20px;
            left: 0;
            .btn-wrap{
                padding: 0 20px;
            }
        }
    }
}
</style>
