<template>
<div class="step-1-component">
    <div class="send-fil-box">
        <div class="back-wrap">
            <kyBack :name="$t('sendFil.send')" @pageBack="sendBack" />
        </div>
        <div class="send-content">
            <div class="input-item">
                <div class="label">{{$t('sendFil.token')}}</div>
                <div class="value" @click="tokenVisible = true">
                    <div class="main-logo" v-if="formData.isMain">
                        <div class="logo" v-if="activenNetworks.length">
                            <div class="img-wrap" v-if="owenChain">
                                <img class="img" :src="require(`@/assets/svg/${chainImg}`)"/>
                            </div>
                            <div class="custom-img" v-else>{{chainName.substring(0,1)}}</div>
                        </div>
                    </div>
                    <div class="token-logo" v-else>
                        <div class="logo">
                            <kyCanvas :contract="formData.contract" />
                        </div>
                    </div>
                    <div class="token">{{formData.symbol}}</div>
                    <div class="name">{{formData.chainName}}</div>
                    <div class="icon">
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>
            </div>
            <div class="input-item">
                <div class="label">{{$t('sendFil.toAddress')}}</div>
                <div class="value">
                    <div class="name" v-if="formData.toName">{{formData.toName.substring(0,8)}}</div>
                    <div class="address">
                        <kyInput :value="formData.to" @changeInput="toChange"/>
                    </div>
                    <div class="icon" @click="addressVisible = true">
                        <i class="el-icon-notebook-1"></i>
                    </div>
                </div>
            </div>
            <div class="input-item">
                <div class="label">{{$t('sendFil.number')}}</div>
                <div class="value">
                    <kyInput
                        :value="formData.fil"
                        type="number"
                        @keydown.native="channelInputLimit"
                        @changeInput="filChange"
                    />
                    <div class="all" @click="allFil">{{$t('sendFil.all')}}</div>
                </div>
                <div class="available">
                    {{ $t('sendFil.available') }} :
                    {{ formData.balance | formatBalance(12)}}
                    {{ formData.symbol }}
                </div>
            </div>
        </div>
        <div class="position">
            <div class="btn-wrap">
                <kyButton :type="'primary'" :active="active" @btnClick="next">
                    {{$t('sendFil.send')}}
                </kyButton>
            </div>
        </div>

        <el-dialog
            :visible.sync="tokenVisible"
            width="100%"
            :fullscreen='true'
            :top="'0'"
            :show-close="false"
        >
            <kyToken
                @selectToken="selectToken"
                @colseToken="tokenVisible = false"
            />
        </el-dialog>
        <el-dialog
            :visible.sync="addressVisible"
            width="100%"
            :fullscreen='true'
            :top="'0'"
            :show-close="false"
        >
            <kyAddress
                @selectAddress="selectAddress"
                @colseAddress="addressVisible = false"
            />
        </el-dialog>
    </div>
</div>
</template>

<script>
import kyBack from '@/components/back'
import kyInput from '@/components/input'
import kyButton from '@/components/button'
import kyAddress from './address.vue'
import kyToken from './token.vue'
import kyCanvas from '@/components/canvas'
import { isValidAddress, formatNumber } from '@/utils'
import { mapState } from 'vuex'
import { BigNumber } from 'bignumber.js'
export default {
  data () {
    return {
      // send-fil  select-token  select-address
      pageType: 'send-fil',
      tokenVisible: false,
      addressVisible: false,
      logo: require('@/assets/image/logo.png'),
      accountList: [],
      addressRecordLast: [],
      addressBook: []
    }
  },
  props: {
    formData: Object
  },
  computed: {
    ...mapState('app', [
      'rpc',
      'symbol',
      'networkType',
      'decimals',
      'activenNetworks'
    ]),
    active () {
      return this.formData.to !== '' && this.formData.fil !== ''
    },
    owenChain () {
      let volid = false
      if (this.activenNetworks.length) {
        volid = this.activenNetworks[0].disabled
      }
      return volid
    },
    chainImg () {
      let src = ''
      if (this.activenNetworks.length) {
        src = this.activenNetworks[0].image
      }
      return src
    },
    chainName () {
      let name = ''
      if (this.activenNetworks.length) {
        name = this.activenNetworks[0].name
      }
      return name
    }
  },
  filters: {
    formatBalance (val, n) {
      const dec = Number(val)
      const big = new BigNumber(dec)
      const str = big.toFixed()
      const num = formatNumber(str, n)
      return num
    }
  },
  components: {
    kyBack,
    kyInput,
    kyButton,
    kyAddress,
    kyToken,
    kyCanvas
  },
  methods: {
    sendBack () {
      this.$router.go(-1)
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
      // 不允许输入'e'和'.'
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
    next () {
      if (this.active) {
        const volid = isValidAddress(this.formData.to, this.networkType)
        if (volid) {
          this.$emit('next')
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
