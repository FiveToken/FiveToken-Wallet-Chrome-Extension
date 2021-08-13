<template>
    <div class="confirm-content">
         <div class="back" @click="back">
             <i class="el-icon-arrow-left"></i>
             <span>{{$t('sendFil.edit')}}</span>
         </div>
         <div class="from-to">
             <div class="from">{{accountName}}</div>
             <div class="icon"><i class="el-icon-right"></i></div>
             <div class="to">{{to}}</div>
         </div>
         <div class="fil-content">
             <div class="send">{{$t('sendFil.sendFil')}}</div>
             <div class="amount">
                 <div class="fil">{{ fil }} FIL</div>
                <div class="usd">{{ filUsd}} USD</div>
             </div>
         </div>
         <div class="gas-content">
             <div class="left">GAS FEE</div>
             <div class="right">
                 <div class="g-middle">
                     <div class="amount">{{gasFee / Math.pow(10, 18)}}</div>
                     <div class="unit"> FIL</div>
                 </div>
                 <div class="g-bottom">$ {{gasFeeUsd / Math.pow(10, 18)}}</div>
             </div>
         </div>
         <div class="total-content">
             <div class="left">TOTAL</div>
             <div class="right">
                <div class="t-top">AMOUNT + GAS FEE</div>
                <div class="t-middle">
                     <div class="amount">{{totalFee/Math.pow(10, 18)}}</div>
                     <div class="unit"> FIL</div>
                </div>
                 <div class="t-bottom">$ {{totalFeeUsd/Math.pow(10, 18)}}</div>
             </div>
         </div>
        <div class="input-item">
            <div class="label">{{$t('sendFil.password')}}</div>
            <el-input v-model="password" type="password" @input="passwordInput"> </el-input>
        </div>
        <div class="error" v-if="error">
            {{ error }}
        </div>
         <div class="position">
            <div class="btn-wrap">
                <el-button @click="back">{{$t('sendFil.cancel')}}</el-button>
                <el-button type="primary" @click="confirm" :disabled="disabled">{{$t('sendFil.confirm')}}</el-button>
            </div>
        </div>
        <div class="loading" v-if="confrim">
            <img :src="loading" alt="">
        </div>
     </div>
</template>
<script>
export default {
    data(){
        return{
            loading:require('@/assets/image/loading.png'),
            password:'',
            error:''
        }
    },
    computed:{
        disabled(){
            return this.password === ''
        }
    },
    props:{
        step:Number,
        accountName:String,
        to:String,
        fil:Number,
        filUsd:Number,
        gasFee:Number,
        totalFee:Number,
        gasFeeUsd:Number,
        totalFeeUsd:Number,
        pageType:String,
        confrim:Boolean
    },
    methods:{
        confirm(){
            this.$emit('update:confrim', true)
            this.$emit("sendFil",this.password)
        },
        passwordInput(){
            this.error = ''
        },
        back(){
            // pageType
          this.$emit('update:pageType','send-fil')
          this.$emit('update:step', 1)
        }
    }
}
</script>

<style  lang="less" scoped>
 .confirm-content{
    height: 540px;
    position: relative;
    .loading{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
    }
        .back{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            color: #589FDC;
            border-bottom: 1px solid #eee;
            padding: 10px;
            i{
                font-size: 18px;
            }
            .text{
                font-size: 14px;
            }
        }
        .from-to{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #eee;
            .from{

            }
        }
        .fil-content{
            padding: 10px;
            background: #F9FAFA;
            color: #999;
            border-bottom: 1px solid #eee;
            .send{
                width: 70px;
                height: 28px;
                text-align: center;
                line-height: 28px;
                border: 1px solid #999;
                border-radius: 5px;
                margin-bottom: 6px;
                font-size: 12px;
            }
            .amount{
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #999;
                .fil{
                    font-size: 18px;
                    margin-right: 5px;
                }
                .usd{
                    font-size: 14px;
                }
            }
        }
        .gas-content{
            display: flex;
            padding: 0 10px;
            justify-content: space-between;
            align-items: center;
            position: relative;
            &::after{
                position: absolute;
                content: '';
                bottom:0;
                left: 10px;
                width: calc(100% - 20px);
                height: 1px;
                background: #eee;
            }
            .left{
                font-size: 14px;
                color: #999;
            }
            .right{
                padding: 10px 0;
                text-align: right;
                .g-top{
                    font-size: 14px;
                    color: #589FDC;
                    margin-bottom: 5px;
                }
                .g-middle{
                    display: flex;
                    align-items: center;
                    margin-bottom: 5px;
                    justify-content: flex-end;
                    .unit{
                        font-size: 12px;
                        color: #999;
                        margin-right: 5px;
                    }
                    .amount{
                        font-size: 18px;
                        font-weight: bolder;
                        color: #222;
                    }
                }
                .g-bottom{

                }
            }
        }
        .total-content{
            display: flex;
            padding: 0 10px;
            justify-content: space-between;
            align-items: center;
            position: relative;
            &::after{
                position: absolute;
                content: '';
                bottom:0;
                left: 10px;
                width: calc(100% - 20px);
                height: 1px;
                background: #eee;
            }
            .left{
                font-size: 14px;
                color: #999;
            }
            .right{
                padding: 10px 0;
                text-align: right;
                .t-top{
                    font-size: 14px;
                    margin-bottom: 10px;
                    color: #222;
                }
                .t-middle{
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    margin-bottom: 5px;
                    .unit{
                        font-size: 12px;
                        color: #999;
                        margin-right: 5px;
                    }
                    .amount{
                        font-size: 18px;
                        font-weight: bolder;
                        color: #589FDC;
                    }
                }
                .t-bottom{

                }
            }
        }
        .input-item{
            padding: 10px 10px 5px;
            .label{
                font-size: 14px;
                color: #222;
                margin-bottom: 10px;
            }
        }
        .error{
            padding:0 10px;
            font-size: 14px;
            color: #FD334C;
        }
        .position{
            position: absolute;
            left: 0;
            bottom: 0;
            padding:10px;
            border-top: 1px solid #eee;
            width: 100%;
            box-sizing: border-box;
            .btn-wrap{
                display: flex;
                /deep/.el-button{
                    flex-grow: 1;
                }
            }
        }
    }
</style>
