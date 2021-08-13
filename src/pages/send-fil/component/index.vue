<template>
<div class="send-fil">
    <bHeader />
    <stepOne 
        v-if="step === 1" 
        :type.sync="type"
        :customVisible.sync="customVisible"
        :to.sync="to"
        :fil.sync="fil"
        :price_usd="price_usd"
        :ordinary='ordinary'
        :fast="fast"
        :custom="custom"
        :step.sync="step"
        :pageType.sync="pageType"
        :balance="balance"
        :address="address"
        @next="next"
        @reset="reset"
    />
    <stepTwo 
        v-else 
        :step.sync="step"
        :accountName="accountName"
        :to="to"
        :fil="fil"
        :filUsd="filUsd"
        :price_usd="price_usd"
        :gasFee="gasFee"
        :totalFee="totalFee"
        :gasFeeUsd="gasFeeUsd"
        :totalFeeUsd="totalFeeUsd"
        :pageType.sync="pageType"
        :confrim.sync="confrim"
        @sendFil="sendFil"
    />
    <el-dialog
        :visible.sync="customVisible"
        width="95%"
        :show-close="false"
    >
        <div class="dialog-content">
            <div class="close" @click="customVisible = false"><i class="el-icon-close"></i></div>
            <div class="top">
                <div class="title">{{$t('sendFil.customFuel')}}</div>
                <div class="sub-title">{{$t('sendFil.senior')}}</div>
            </div>
            <div class="miner-fee">
                <div class="text">{{$t('sendFil.minerFees')}}</div>
                <i class="el-icon-question"></i>
                <el-input v-model="custom.nanofil" min='0' type='number' @input="customFil"><template slot="append">nanoFIL</template></el-input>
            </div>
            <div class="info-wrap">
                <div class="info-item">
                    <div class="key">{{$t('sendFil.sendAmount')}}</div>
                    <div class="value">{{fil}} FIL</div>
                </div>
                <div class="info-item">
                    <div class="key">{{$t('sendFil.transFees')}}</div>
                    <div class="value">{{custom.cost/Math.pow(10, 18)}} FIL</div>
                </div>
                <div class="info-item">
                    <div class="key">{{$t('sendFil.newTotal')}}</div>
                    <div class="value">
                        <div class="bolder">{{custom.totalFil/Math.pow(10, 18)}} FIL</div>
                        <div> {{(custom.totalFil*price_usd/Math.pow(10, 18)).toFixed(2)}} USD</div>
                    </div>
                </div>
            </div>
            <div class="btn-wrap">
                <el-button @click="save" type="primary" :disabled="!disabled">{{$t('sendFil.save')}}</el-button>
            </div>
        </div>
    </el-dialog>
</div>
</template>

<script>
import bHeader from '@/components/header'
import stepOne from './step-1'
import stepTwo from './step-2'
import { fil2atto} from '@/utils'
import { BalanceNonceByAddress,BaseFeeAndGas,MessagePush,FilPricePoints } from '@/utils/api'
import { getT1SignedMsg } from '@/utils/message'
import { privateKeyDecode,validatePrivateKey,genPrivateKeyDigest} from '@/utils/key'
import { debounce } from 'lodash'
export default {
    data(){
        return{
            confrim:false,
            // send-fil , add-address , my-address , address-error
            pageType:'add-address',
            address:'',
            balance:0,
            type:1,
            step:1,
            price_usd:0,
            customVisible:false,
            ordinary:{
                name:this.$t('sendFil.normal'),
                type:2,
                cost:0,
            },
            fast:{
                name:this.$t('sendFil.fast'),
                type:1,
                cost:0,
            },
            custom:{
                name:this.$t('sendFil.custom'),
                type:3,
                gasfee_cap:0,
                nanofil:'',
                cost:0,
                totalFil:0,
            },
            base_fee:'',
            gas_used:'',
            accountName:'',
            to:'',
            fil:0,
            gasFee:0,
            gasFeeUsd:0,
            totalFee:0,
            totalFeeUsd:0,
            filUsd:0,
            digest:'',
            nonce:0,
            maxNonce:0,
        }
    },
    computed:{
        disabled(){
            return this.custom.nanofil !== '' && this.custom.nanofil !== 0
        }
    },
    components:{
        bHeader,
        stepOne,
        stepTwo
    },
    watch:{
        to(newVal){
            this.getBaseFeeAndGas(newVal)
        }
    },
    async mounted(){
        let activeAccount = await window.filecoinwalletDb.activeAccount.where({ kunyao:'kunyao'}).toArray ()|| [];
        this.address = activeAccount.length && activeAccount[0].address
        this.accountName = activeAccount.length && activeAccount[0].accountName
        this.digest = activeAccount.length && activeAccount[0].digest
        this.getFilPricePoints()
        this.getBalanceNonceByAddress()
        
    },
    methods:{
        async getNextNonce(){
            let time = parseInt(new Date().getTime() / 1000)
            let messageList = await window.filecoinwalletDb.messageList.where({ kunyao:'kunyao'}).toArray () || [];
            let myMsgList =  messageList.filter(n=>{
                return n.from === this.address
            })
            let creatTimeList = myMsgList && myMsgList.map(n=>{
                return n.create_time
            }) || []
            let nonceList = myMsgList && myMsgList.map(n=>{
                return n.nonce || 0
            }) || []
            let maxDbCreateTime = creatTimeList.length && Math.max(...creatTimeList) || 0
            let maxDbNonce = nonceList.length && Math.max(...nonceList)
            // nonce time > 300s res.nonce ,else db none
            // The time since the last transmission is greater than 5 minutes nonce = res.nonce,
            let maxNonce = time - maxDbCreateTime > 300 ? this.nonce : Math.max(this.nonce,maxDbNonce)
            this.maxNonce = maxNonce
        },
        // get balance and nonce
        getBalanceNonceByAddress(){
            let address = this.address
            BalanceNonceByAddress([{address}]).then(result=>{
                try{
                    let res = result.data
                    if(res && res.code === -32603){
                        this.balance = 0
                    }else{
                        this.nonce = res.nonce
                        this.balance = Number(res.balance)/Math.pow(10, 18)
                        this.getNextNonce()
                    }
                }catch(e){
                    this.balance = 0
                }
            })
        },
        // get service charge
        getBaseFeeAndGas(address){
            let params = [address, 0]
            BaseFeeAndGas(params).then(result=>{
                let res = result.data
                if(res.base_fee){
                    this.base_fee = Number(res.base_fee)
                    this.gas_used = Number(res.gas_used)
                    let gas_premium = Number(res.gas_premium)// this.gasPremium()
                    let ordinary_gasfee_cap = this.gasFeeCap(res.base_fee,2.9,4.9,gas_premium)
                    let gas_limit = this.gasLimit(res.actor_exist,res.gas_used)
                    this.$set(this.ordinary,'gas_premium',gas_premium)
                    this.$set(this.ordinary,'gasfee_cap',ordinary_gasfee_cap)
                    this.$set(this.ordinary,'gas_limit',gas_limit)
                    this.$set(this.ordinary,'cost',ordinary_gasfee_cap*gas_limit)

                    let fast_gasfee_cap = this.gasFeeCap(res.base_fee,3,5,gas_premium)
                    this.$set(this.fast,'gas_premium',gas_premium)
                    this.$set(this.fast,'gasfee_cap',fast_gasfee_cap)
                    this.$set(this.fast,'gas_limit',gas_limit)
                    this.$set(this.fast,'cost',fast_gasfee_cap*gas_limit)
                }else{
                    this.errorInit()
                }
            }).catch(err=>{
                this.errorInit()
            })
        },
        errorInit(){
            this.base_fee = 0
            this.gas_used = 0
            this.$set(this.ordinary,'gas_premium',0)
            this.$set(this.ordinary,'gasfee_cap',0)
            this.$set(this.ordinary,'gas_limit',0)
            this.$set(this.ordinary,'cost',0)

            this.$set(this.fast,'gas_premium',0)
            this.$set(this.fast,'gasfee_cap',0)
            this.$set(this.fast,'gas_limit',0)
            this.$set(this.fast,'cost',0)
        },
        gasLimit(actor_exist,gas_used){
            let gas = (Number(gas_used))*1.25
            let gas_limit = actor_exist ? Math.floor(gas) : 2200000;
            return gas_limit
        },
        gasFeeCap(base_fee,base_fee_ratio,nano_ratio,gas_premium){
            // let gasfee_cap = Math.max(base_fee_ratio * Number(base_fee), nano_ratio * Math.pow(10, 9));
            let gasfee_cap = base_fee_ratio * Number(base_fee) + gas_premium
            return gasfee_cap
        },
        gasPremium(){
            let gas_premium = Math.pow(10, 6)
            return gas_premium
        },
        getFilPricePoints(){
            FilPricePoints(['real']).then(result=>{
                let res = result.data
                if(res && res.data.length){
                    this.price_usd = Number(res.data[0].price_usd)
                }
            })
        },
        next(){
            this.filUsd = this.fil * this.price_usd
            switch(this.type){
                case 1:
                    this.gasFee = this.fast.gasfee_cap * this.fast.gas_limit
                    this.gasFeeUsd = this.gasFee * this.price_usd
                    this.totalFee = this.gasFee + this.fil*Math.pow(10, 18)
                    this.totalFeeUsd = this.totalFee * this.price_usd
                    break;
                case 2:
                    this.gasFee = this.ordinary.gasfee_cap * this.ordinary.gas_limit
                    this.gasFeeUsd = this.gasFee * this.price_usd
                    this.totalFee = this.gasFee + this.fil*Math.pow(10, 18)
                    this.totalFeeUsd = this.totalFee * this.price_usd
                    break;
                case 3:
                    this.gasFee = this.custom.cost
                    this.gasFeeUsd = this.gasFee * this.price_usd
                    this.totalFee = this.custom.totalFil
                    this.totalFeeUsd = this.totalFee * this.price_usd
                    break;
            }
            if(this.totalFee/Math.pow(10, 18) > this.balance){
                this.$message.error(this.$t('sendFil.insufficientBalance'))
            }else{
                this.step = 2
            }
        },
        getCostGas(){
            switch(this.type) {
                case 1:
                    return {
                       gas_premium:this.fast.gas_premium,
                       gasfee_cap:this.fast.gasfee_cap,
                       gas_limit:this.fast.gas_limit,
                    }
                    break;
                case 2:
                    return {
                       gas_premium:this.ordinary.gas_premium,
                       gasfee_cap:this.ordinary.gasfee_cap,
                       gas_limit:this.ordinary.gas_limit,
                    }
                    break;
                case 3:
                    return {
                       gas_premium:this.custom.gas_premium,
                       gasfee_cap:this.custom.gasfee_cap,
                       gas_limit:this.custom.gas_limit,
                    }
                    break;
                default:
                    return {
                       gas_premium:this.fast.gas_premium,
                       gasfee_cap:this.fast.gasfee_cap,
                       gas_limit:this.fast.gas_limit,
                    }
            } 
        },
        // custom service charge
        customFil(){
            // transactionCosts gas_limit * gasfee_cap
            // totalFil  cost + fil
            // totalUsd  totalFil *  price_usd
            if(this.custom.nanofil){
                let gasfee_cap = this.custom.nanofil*Math.pow(10, 9) + this.base_fee
                let gas_premium = 0.01*Math.pow(10, 9)
                let gas_limit = this.gas_used * 1.25
                let cost = gasfee_cap * gas_limit
                let totalFil = cost + this.fil*Math.pow(10, 18)
                this.$set(this.custom,'gas_premium',gas_premium)
                this.$set(this.custom,'gasfee_cap',gasfee_cap)
                this.$set(this.custom,'gas_limit',gas_limit)
                this.$set(this.custom,'cost',cost)
                this.$set(this.custom,'totalFil',totalFil)
            }else{
                this.$set(this.custom,'gas_premium','')
                this.$set(this.custom,'gasfee_cap',0)
                this.$set(this.custom,'gas_limit','')
                this.$set(this.custom,'cost',0)
                this.$set(this.custom,'totalFil',0)
            }
        },
        reset(){
            this.type = 1
            this.$set(this.custom,'gas_premium','')
            this.$set(this.custom,'gasfee_cap',0)
            this.$set(this.custom,'gas_limit','')
            this.$set(this.custom,'cost',0)
            this.$set(this.custom,'totalFil',0)
            this.$set(this.custom,'nanofil','')
        },
        // send message
        async sendFil(password){
            let activeAccount = await window.filecoinwalletDb.activeAccount.where({ kunyao:'kunyao'}).toArray ()|| [];
            let encodePrivateKey = activeAccount.length && activeAccount[0].privateKey
            let address = this.address
            let privateKey = privateKeyDecode(encodePrivateKey,address, password)
            let voild = await validatePrivateKey(address,password,encodePrivateKey,this.digest)
            if(voild){
                let costGas = this.getCostGas()
                let { gas_premium ,gasfee_cap,gas_limit} = costGas
                let value = fil2atto(this.fil)
                let msg = {
                    Version: 0,
                    To: this.to,
                    From: this.address,
                    Nonce:this.maxNonce,
                    Value: value,
                    GasPremium: gas_premium.toString(),
                    GasFeeCap: gasfee_cap.toString(),
                    GasLimit: Math.ceil(gas_limit),
                    Method: 0,
                    Params: ''
                };
                // SignedMessage
                let signedMsg = await getT1SignedMsg(msg, privateKey)
                let objparams = [{
                    ...signedMsg
                }]
                this.mesgPush(objparams)
            }else{
                this.confrim = false
                this.$message.error(this.$t('sendFil.error')) 
            }
        },
        // Message push
        mesgPush(params){
            MessagePush(params).then(async (res)=>{
                this.confrim = false
                let signed_cid = res.data['/']
                let create_time =  parseInt(new Date().getTime() / 1000)
                await window.filecoinwalletDb.messageList.add({
                    signed_cid,
                    from:this.address,
                    to:this.to,
                    create_time,
                    block_time:create_time,
                    nonce:this.maxNonce+1,
                    type:'pending',
                    typeName:this.$t('sendFil.waiting'),
                    kunyao:'kunyao',
                    value:this.fil*Math.pow(10, 18)
                })
                await window.filecoinwalletDb.addressRecordLast.where({address:this.to}).delete()
                await window.filecoinwalletDb.addressRecordLast.add({
                    address:this.to,
                    create_time,
                    kunyao:'kunyao',
                })
                window.location.href = './wallet.html'
            }).catch(err=>{
                this.confrim = false
                console.log(err,'MessagePush error')
            })
        },
        save(){
            this.type = 3
            this.customVisible = false
        }
    }
}
</script>

<style  lang="less" scoped>
.send-fil{
    width: 100%;
    margin: 0 auto;
    box-shadow: 0px 4px 18px 0px rgb(19 30 47 / 9%);
    border-radius: 5px;
    position: relative;
}
/deep/.el-dialog__header{
        padding: 0;
    }
    /deep/.el-dialog__body{
        padding: 0;
    }
    .dialog-content{
        position: relative;
        .close{
            position: absolute;
            right: 10px;
            top: 10px;
        }
        .title{
            text-align: center;
            font-size: 16px;
            color: #222;
            font-weight: bolder;
            padding: 10px;
        }
        .sub-title{
            font-size: 14px;
            color: #666;
            text-align: center;
            padding: 0 10px 20px;
            border-bottom: 1px solid #eee;
        }
        .transaction-cost{
            padding: 10px;
            font-size: 14px;
            border-bottom: 1px solid #eee;
            .text{
                margin-bottom: 8px;
                color: #666;
            }
            .amount{
                color: #222;
                font-weight: bolder;
            }
        }
        .miner-fee{
            display: flex;
            padding: 10px;
            align-items: center;
            padding-bottom: 100px;
            border-bottom: 1px solid #eee;
            .text{
                flex-shrink: 0;
            }
            .el-icon-question{
                padding-right: 10px;
            }
        }
        .info-wrap{
            padding: 10px;
            border-bottom: 1px solid #eee;
            .info-item{
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                .value{
                    text-align: right;
                    .bolder{
                        font-weight: bolder;
                    }
                }
            }
        }
        .btn-wrap{
            padding: 10px;
            /deep/.el-button{
                width: 100%;
            }
        }
    }

</style>
