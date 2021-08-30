<template>
    <div class="step-2-component">
         <div class="back-wrap">
            <kyBack :name="$t('sendFil.confirmTransaction')" @pageBack="back" />
         </div>
         <div class="send-info">
            <!-- <div class="logo">
                <img :src="logo" alt="" class="img">
            </div> -->
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
            
            <div class="amount">
                {{ formData.fil | formatFil}} {{formData.symbol}}
            </div>
            <div class="send-amount">{{$t('sendFil.sendAmount')}}</div>
            <div class="from-to">
                <div class="from">{{address | addressFormat}}</div>
                <div class="l">
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div class="to">{{formData.to | addressFormat}}</div>
            </div>
         </div>
        <div class="service-fee">
            <el-collapse accordion>
                <el-collapse-item>
                    <template slot="title">
                        <div class="fee-title">
                            <div class="label">{{$t('sendFil.maxGas')}}</div>
                            <div class="amount">
                                <div class="token">{{ allGasFee | formatGas(8)}} {{symbol}}</div>
                                <div class="usd">
                                    {{ currency === 'cny' ? "¥" : "$"}} 
                                    {{ allGasFee | formatUSD(8,price_currency)}}
                                </div>
                            </div>
                        </div>
                    </template>
                    <div class="fee-detail">
                        <div class="gasfee">
                            <div class="label">
                                {{$t('sendFil.networkGas')}}（{{gasUnit}})
                                <div class="question">
                                    <el-popover
                                        placement="bottom"
                                        width="200"
                                        trigger="click"
                                        :content="baseFeeTips">
                                        <i slot="reference" class="el-icon-question"></i>
                                    </el-popover>
                                </div>
                                
                            </div>
                            <kyInput 
                                :value="formData.gasFeeCap"
                                @keydown.native="channelInputLimit"
                                @changeInput='gasFeeCapChange'
                                type="number"
                            ></kyInput>
                            <div class="tips" v-if="formData.gasFeeCap < baseFeeCap">
                                {{$t('sendFil.gasFeeError')}}
                            </div>
                        </div>
                        <div class="gaslimit">
                            <div class="label">
                                {{$t('sendFil.gasLimit')}}
                                <div class="question">
                                    <el-popover
                                        placement="bottom"
                                        width="200"
                                        trigger="click"
                                        :content="$t('sendFil.gasLimitTips')"
                                    >
                                        <i slot="reference" class="el-icon-question"></i>
                                    </el-popover>
                                </div>
                            </div>
                            <kyInput 
                                :value="formData.gasLimit" 
                                @keydown.native="channelInputLimit"
                                @changeInput='gasLimitChange'
                                type="number"
                            ></kyInput>
                            <div class="tips" v-if="formData.gasLimit < baseLimit">
                                {{$t('sendFil.gasLimitError')}}
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div class="total" v-if="formData.isMain">
            <div class="total-tips">{{$t('sendFil.totalTips')}}</div>
            <div class="row">
                <div class="label">{{$t('sendFil.total')}}</div>
                <div class="value">{{ total }} {{symbol}}</div>
            </div>
        </div>
       
        <div class="position">
            <div class="btn-wrap">
                <kyButton @btnClick="back">{{$t('sendFil.cancel')}}</kyButton>
                <kyButton :type="'primary'" @btnClick="send" :active="active">
                    {{$t('sendFil.confirm')}}
                </kyButton>
            </div>
        </div>
     </div>
</template>
<script>
import { mapState } from 'vuex'
import kyBack from '@/components/back'
import kyInput from '@/components/input'
import kyButton from '@/components/button'
import {isFilecoinChain,formatNumber } from '@/utils'
import { BigNumber } from "bignumber.js";
import kyCanvas from "@/components/canvas";
export default {
    data(){
        return{
            logo:require('@/assets/image/fil-w.png'),
        }
    },
    filters:{
        formatFil(val){
            let big = new BigNumber(val)
            let str = big.toFixed()
            let num = formatNumber(str,12)
            return num
        },
        formatGas(val,n){
            let big = new BigNumber(val)
            let str = big.toFixed()
            let num = formatNumber(str,n)
            return num
        },
        formatUSD(val,n,price_currency){
            let usd = val * price_currency
            let big = new BigNumber(usd)
            let str = big.toFixed()
            let num = formatNumber(str,n)
            return num
        },
        addressFormat(val){
            if(val.length>16){
                return val.substr(0,8) + '...' + val.substr(val.length-8,8)
            }else{
                return val
            } 
        },
    },
    computed:{
        ...mapState('app',[
            'rpc',
            'symbol',
            'address',
            'networkType',
            'currency',
            'activenNetworks'
        ]),
        allGasFee(){
            let gas = this.formData.gasFeeCap * this.formData.gasLimit / Math.pow(10,Number(9))
            return gas || 0
        },
        gasUnit(){
            let unit = ''
            if(isFilecoinChain(this.networkType)){
                unit = 'nanoFIL'
            }else{
                unit = 'GWEI'
            }
            return unit
        },
        total(){
            let total = 0
            total = Number(this.formData.fil) + this.allGasFee
            let big = new BigNumber(total).toFixed()
            let str = formatNumber(big,12)
            return str
        },
        active(){
            return this.formData.gasFeeCap !== "" && this.formData.gasLimit !== ""
        },
        baseFeeTips(){
             let str = ''
            if(isFilecoinChain(this.networkType)){
                str = this.$t('sendFil.filBaseFeeTips')
            }else{
                str = this.$t('sendFil.baseFeeTips')
            }
            return str + this.symbol
        },
        owenChain(){
            let volid = false
            if(this.activenNetworks.length){
                 volid = this.activenNetworks[0].disabled
            }
            return volid
        },
        chainImg(){
            let src = ''
            if(this.activenNetworks.length){
                 src = this.activenNetworks[0].image
            }
            return src
        },
        chainName(){
            let name = ''
            if(this.activenNetworks.length){
                 name = this.activenNetworks[0].name
            }
            return name
        }
    },
    props:{
        formData:Object,
        mainBalance:Number,
        price_currency:Number,
        baseLimit:Number,
        baseFeeCap:Number
    },
    components:{
        kyBack,
        kyInput,
        kyButton,
        kyCanvas
    },
    methods:{
        back(){
            this.$emit('previousStep')
        },
        send(){
            if(this.active){
                if(this.mainBalance > this.allGasFee){
                    if(this.formData.isAll){
                        if(this.formData.isMain === 1){
                            let val =  this.formData.balance - this.allGasFee
                            this.$emit('formDataChange',{
                                key:'fil',
                                value:val,
                            })
                        }else{
                            let val =  this.formData.balance
                            this.$emit('formDataChange',{
                                key:'fil',
                                value:val,
                            })
                        }
                    }
                    this.$emit('sendFil')
                }else{
                    this.$message.error(this.$t('sendFil.insufficientBalance'))
                }
            }
        },

        channelInputLimit (e) {
            let key = e.key
            // 不允许输入'e'和'.'
            if (key === 'e' || key === 'E') {
                e.returnValue = false
                return false
            }
            return true
        },
        gasFeeCapChange(val){
           this.$emit('formDataChange',{
                key:'gasFeeCap',
                value:val,
            })
        },
        gasLimitChange(val){
           this.$emit('formDataChange',{
                key:'gasLimit',
                value:val,
            })
        },
    }
}
</script>

<style  lang="less" scoped>
 .step-2-component{
    height: 100%;
    position: relative;
    .back-wrap{
        border-bottom: 1px solid #eee;
        padding: 15px;
    }
    .send-info{
        padding: 30px 15px;
        .logo{
            width: 30px;
            height: 30px;
            margin: 0 auto 20px;
            .img{
                width: 30px;
                height: 30px;
            }
        }
        .amount{
            font-size: 20px;
            color: #131313;
            font-weight: bold;
            text-align: center;
            margin-bottom: 2px;
        }
        .send-amount{
            font-size: 14px;
            color: #6A6767;
            text-align: center;
            margin-bottom: 25px;
        }
        .from-to{
            display: flex;
            align-items: center;
            justify-content: center;
            .from,.to{
                width: 150px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                background: #F5F5F5;
                border-radius: 5px;
                font-size: 14px;
                color: #101010;
            }
            .l{
                width: 24px;
                height: 24px;
                border-radius: 12px;
                background: #737171;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0 5px;
                i{
                    font-size: 14px;
                    color: #FFF;
                    font-weight: bolder;
                }
            }
        }
    }
    .service-fee{
        padding: 0 15px;
        display: flex;
        align-items: center;
        /deep/.el-collapse{
            width: 100%;
            border: none;
            padding: 15px 0;
            background: #DCF9F9;
            border-radius: 10px;
            .el-collapse-item{
                .el-collapse-item__header{
                    background: transparent;
                    border: none;
                    font-weight: normal;
                }
                .el-collapse-item__content{
                    padding-bottom: 0;
                }
                .el-collapse-item__wrap{
                    border-bottom: none;
                    background: transparent;
                }
                .fee-title{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 10px;
                    box-sizing: border-box;
                    font-size: 14px;
                    color: #101010;
                    .amount{
                        line-height: 20px;
                        .usd{
                            text-align: right;
                        }
                    }
                }
                .fee-detail{
                    padding: 10px;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    box-sizing: border-box;
                    .gasfee,.gaslimit{
                        flex: 0 0 47%;
                        .label{
                            font-size: 12px;
                            color: #101010;
                            line-height: 20px;
                            margin-bottom: 3px;
                            position: relative;
                            .question{
                                position: absolute;
                                right: 0;
                                top: 50%;
                                transform: translateY(-50%);
                                color: #5BC1CA;
                                font-size: 16px;
                                font-weight: bold;
                                cursor: pointer;
                            }
                        }
                        .tips{
                            font-size: 12px;
                            color: #1C818A;
                            line-height: 20px;
                            padding-top: 3px;
                        }
                    }
                }
            }
        }
    }
    .total{
        padding: 15px;
        font-size: 14px;
        color: #101010;
        .total-tips{
            text-align: right;
            margin-bottom: 5px;
        }
        .row{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
    .position{
        position: absolute;
        left: 0;
        bottom: 0;
        padding:15px;
        border-top: 1px solid #eee;
        width: 100%;
        box-sizing: border-box;
        .btn-wrap{
            display: flex;
            justify-content: space-between;
            align-items: center;
            /deep/.button-wrap{
                width: 155px;
            }
        }
    }
}
</style>
