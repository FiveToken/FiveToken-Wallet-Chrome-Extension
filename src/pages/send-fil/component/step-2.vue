<template>
    <div class="step-2-component">
         <div class="back-wrap">
            <kyBack :name="$t('sendFil.confirmTransaction')" @pageBack="back" />
         </div>
         <div class="send-info">
            <div class="logo">
                <img :src="logo" alt="" class="img">
            </div>
            <div class="amount">
                {{(formData.fil ) | formatBalance(8)}}
                {{formData.symbol}}
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
                                <div class="token">{{ allGasFee | formatBalance(8)}} {{symbol}}</div>
                                <div class="usd">$ {{ allGasFee | formatUSD(4,price_usd)}}</div>
                            </div>
                        </div>
                    </template>
                    <div class="fee-detail">
                        <div class="gasfee">
                            <div class="label">{{$t('sendFil.networkGas')}}（{{gasUnit}})</div>
                            <kyInput :value="formData.gasFeeCap" @changeInput='gasFeeCapChange'></kyInput>
                        </div>
                        <div class="gaslimit">
                            <div class="label">Gas Limit</div>
                            <kyInput :value="formData.gasLimit" @changeInput='gasLimitChange'></kyInput>
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
import { getGasFeeCap,isFilecoinChain } from '@/utils'
export default {
    data(){
        return{
            logo:require('@/assets/image/fil-w.png'),
        }
    },
    filters:{
        formatBalance(val,n){
            var str = String(val);
            let index = str.indexOf('.')
            if(index > -1){
                let arr = str.split(".")
                let num = arr[0] + "." + arr[1].substring(0,n)
                return num
            }else{
                return val
            }
        },
        formatUSD(val,n,price_usd){
            let usd = val * price_usd
            var str = String(usd);
            let index = str.indexOf('.')
            if(index > -1){
                let arr = str.split(".")
                let num = arr[0] + "." + arr[1].substring(0,n)
                return num
            }else{
                return usd
            }
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
        ...mapState('app',['rpc','symbol','address','networkType']),
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
            let total = Number(this.formData.fil) + this.allGasFee
            return total
        },
        active(){
            return true
        }
    },
    props:{
        formData:Object,
        price_usd:Number
    },
    components:{
        kyBack,
        kyInput,
        kyButton
    },
    methods:{
        back(){
            this.$emit('previousStep')
        },
        send(){
            this.$emit('sendFil')
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
        padding: 15px 20px;
    }
    .send-info{
        padding: 30px 20px;
        .logo{
            width: 32px;
            height: 32px;
            border-radius: 16px;
            background: #5BC1CA;
            margin: 0 auto 20px;
            .img{
                width: 32px;
                height: 32px;
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
        padding: 0 20px;
        display: flex;
        align-items: center;
        /deep/.el-collapse{
            width: 100%;
            border: none;
            padding: 15px;
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
                    align-items: center;
                    box-sizing: border-box;
                    .gasfee,.gaslimit{
                        flex: 0 0 45%;
                    }
                }
            }
        }
    }
    .total{
        padding: 20px;
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
