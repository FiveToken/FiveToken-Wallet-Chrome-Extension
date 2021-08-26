<template>
    <layout @layoutMounted="layoutMounted">
        <div class="send-fil">
            <stepOne 
                v-if="step === 1"
                :formData="formData"
                @formDataChange="formDataChange"
                @next="next"
            />
            <stepTwo 
                v-else
                :price_currency="price_currency"
                :formData="formData"
                @formDataChange="formDataChange"
                :baseFeeCap="baseFeeCap"
                :baseLimit="baseLimit"
                @previousStep="step = 1"
                @sendFil="sendFil"
            />

            <div class="loading" v-if="isFetch">
                <img :src="loading" alt="" class="img">
            </div>
        </div>
    </layout>
</template>

<script>
import stepOne from './step-1'
import stepTwo from './step-2'
import layout from '@/components/layout'
import { getDecodePrivateKey,formatNumber,getGlobalKek } from '@/utils'
import { GlobalApi } from '@/utils/api'
import { mapMutations, mapState } from 'vuex'
import ABI from '@/utils/abi'
import { ethers } from 'ethers'
import { BigNumber } from "bignumber.js";
import { Database } from '@/utils/database.js';
export default {
    data(){
        return{
            loading:require('@/assets/image/loading.png'),
            isFetch:false,
            step:1,
            price_currency:0,
            nonce:0,
            maxNonce:0,
            baseFeeCap:0,
            baseLimit:0,
            pkk:'',
            contractSigner:null,
            db:null,
            formData:{
                balance:0,
                to:'',
                toName:'',
                fil:'',
                symbol:'',
                chainName:'',
                gasLimit:0,
                gasPremium:0,
                gasFeeCap:0,
                decimals:0,
                isAll:0,
                isMain:1,
                contract:''
            },
        }
    },
    computed:{
        ...mapState('app',[
            'rpc',
            'address',
            'privateKey',
            'networkType',
            'accountList',
            'activenNetworks',
            'decimals',
            'ids',
            'symbol',
            'currency'
        ])
    },
    components:{
        stepOne,
        layout,
        stepTwo
    },
    methods:{
        ...mapMutations('send-fil',[
            'SET_ACCOUNTLIST',
            'SET_ADDRESSBOOK',
            'SET_ADDRESSRECORDLAST',
            'SET_TOKENLIST'
        ]),
        async layoutMounted(){
            let kek = getGlobalKek()
            this.pkk = getDecodePrivateKey(this.privateKey,kek,this.networkType)
            let db = new Database()
            this.db = db
            let myRecordLast = await db.getTable('addressRecordLast',{
                rpc:this.rpc,
                address:this.address
            })
            this.SET_ADDRESSRECORDLAST(myRecordLast)
            let addressBook =  await db.getTable('addressBook',{rpc:this.rpc})
            
            this.SET_ADDRESSBOOK(addressBook)
            this.SET_ACCOUNTLIST(this.accountList)
            let chainName = this.activenNetworks.length && this.activenNetworks[0].name
            this.$set(this.formData,'chainName',chainName)
            this.$set(this.formData,'symbol',this.symbol)
            this.$set(this.formData,'decimals',this.decimals)
            this.getFilPricePoints()
            await this.getBalanceNonceByAddress()
            this.getTokenList()
        },
        async getTokenList(){
            let list = await this.db.getTable('tokenList',{
                rpc:this.rpc,
                address:this.address 
            })
            let chainImg = this.activenNetworks.length && this.activenNetworks[0].image
            let customNetwork = this.activenNetworks.length && !this.activenNetworks[0].disabled
            let tokenList = [
                {
                    rpc:this.rpc,
                    chainName:this.formData.chainName,
                    decimals:this.decimals,
                    symbol:this.symbol,
                    contract:'',
                    balance:this.formData.balance,
                    isMain:1,
                    image:chainImg,
                    customNetwork
                }
            ]
            let provider = ethers.getDefaultProvider(this.rpc);
            list.forEach(async (n)=>{
                try{
                    let contract = new ethers.Contract(n.contract, ABI, provider);
                    contract.balanceOf(this.address).then(res=>{
                        let balance = res.toString()
                        let num = Number(balance) / Math.pow(10,Number(n.decimals))
                        tokenList.push(
                            {
                                ...n,
                                balance:num,
                                isMain:0,
                                chainName:this.formData.chainName,
                                image:'',
                                contract:n.contract
                            }
                        )
                    })
                }catch(err){
                    console.log(err,'getTokenList err')
                }
            })
            this.SET_TOKENLIST(tokenList)
        },
        formDataChange(obj){
            let {key,value} = obj
            switch(key){
                case 'to':
                    if(value){
                        this.getBaseFeeAndGas(this.address,value,this.maxNonce)
                    }
                    let { accountName } = obj
                    this.$set(this.formData,'toName',accountName)
                    break;
                case 'isAll':
                    if(value === 1){
                        let fil = this.formData.balance
                        this.$set(this.formData,'fil',fil)
                    }
                    break;
                case 'token':
                    let { balance ,symbol,chainName,decimals,isMain,contract } = value
                    this.formData = Object.assign({},this.formData,{
                        balance,
                        fil:'',
                        symbol,
                        chainName,
                        decimals,
                        isAll:0,
                        isMain,
                        contract
                    })
                    break;
                case 'fil':
                    this.$set(this.formData,'isAll',0)
                    break;
            }
            this.$set(this.formData,key,value)
        },
        async getNextNonce(){
            let time = parseInt(new Date().getTime() / 1000)
            let messageList = await this.db.getTable('messageList',{ rpc:this.rpc })
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
            let maxNonce = time - maxDbCreateTime > 300 ? this.nonce : Math.max(this.nonce,maxDbNonce)
            this.maxNonce = maxNonce
        },
        async getBalanceNonceByAddress(){
            let MyGlobalApi = new GlobalApi()
            MyGlobalApi.setRpc(this.rpc)
            MyGlobalApi.setNetworkType(this.networkType)
            let res = await MyGlobalApi.getBalance(this.address)
            let { balance,nonce } = res
            let dec = balance / Math.pow(10,Number(this.decimals))
            let big = new BigNumber(dec).toFixed()
            let num = formatNumber(big,12)
            this.$set(this.formData,'balance',num)
            this.nonce = nonce
            this.getNextNonce()
        },
        async getBaseFeeAndGas(from,to,nonce){
            let MyGlobalApi = new GlobalApi()
            MyGlobalApi.setRpc(this.rpc)
            MyGlobalApi.setNetworkType(this.networkType)
            let res = await MyGlobalApi.getGasFee(from,to,nonce)
            let { gasLimit, gasPremium ,gasFeeCap } = res
            this.$set(this.formData,'gasLimit',gasLimit)
            this.$set(this.formData,'gasPremium',gasPremium)
            this.$set(this.formData,'gasFeeCap',gasFeeCap)
            this.baseFeeCap = gasFeeCap
            this.baseLimit = gasLimit
            if(this.formData.isAll === 1){
                let fil = this.formData.balance
                this.$set(this.formData,'fil',fil)
            }
        },
        async getFilPricePoints(){
            if(this.ids){
                let MyGlobalApi = new GlobalApi()
                MyGlobalApi.setRpc(this.rpc)
                MyGlobalApi.setNetworkType(this.networkType)
                let res = await MyGlobalApi.getPrice(this.ids)
                let { usd,cny } = res
                if(this.currency === 'cny'){
                    this.price_currency = cny
                }else{
                    this.price_currency = usd
                }
            }
            
        },
        async next(){
            let balance = this.formData.balance
            let fil = Number(this.formData.fil)
            let reg = /^((0)?|[1-9]*) + (.)? + [1-9]*$/
            let isNumber =  new BigNumber(fil).isPositive()
            if(isNumber){
                if( fil > balance){
                    this.$message.error(this.$t('sendFil.insufficientBalance'))
                }else{
                    this.step = 2
                    this.isFetch = true
                    await this.getBaseFeeAndGas(this.address,this.formData.to,this.maxNonce)
                    this.isFetch = false
                    let gas = (this.formData.gasFeeCap * this.formData.gasLimit) / Math.pow(10, 9)
                    // all banance > gas 
                    if(this.formData.isAll === 1){
                        if(balance > gas){
                            let fil = balance - gas
                            this.$set(this.formData,'fil',fil)
                        }else{
                            this.$message.error(this.$t('sendFil.insufficientBalance'))
                        }
                    }
                    if(this.formData.isMain !== 1){
                        let double = this.formData.gasLimit * 2.5
                        this.$set(this.formData,'gasLimit',double)
                        let provider = ethers.getDefaultProvider(this.rpc);
                        let wallet = new ethers.Wallet(this.pkk, provider);
                        let contractSigner = new ethers.Contract(this.formData.contract, ABI, wallet);
                        this.contractSigner = contractSigner
                    }
                }
            }else{
                this.$message.error(this.$t('sendFil.vaildNumber'))
            }
            
        },
        async sendToken(){
            this.isFetch = true
            try{
                // let provider = ethers.getDefaultProvider(this.rpc);
                // let wallet = new ethers.Wallet(this.pkk, provider);
                // let contractSigner = new ethers.Contract(this.formData.contract, ABI, wallet);
                let numberOfTokens = ethers.utils.parseUnits(this.formData.fil, this.formData.decimals);
                let allGasFee = this.formData.gasFeeCap * this.formData.gasLimit * Math.pow(10, 9)
                let res = await this.contractSigner.transfer(this.formData.to,numberOfTokens,{
                    gasPrice: this.formData.gasFeeCap * Math.pow(10, 9),
                    gasLimit: Math.ceil(this.formData.gasLimit),
                })
                if(res){
                    let create_time =  parseInt(new Date().getTime() / 1000)
                    let _value = this.formData.fil * Math.pow(10, Number(this.formData.decimals))
                    await this.db.addTable('messageList',{
                        signed_cid:res.hash,
                        from:this.address,
                        to:this.formData.to,
                        create_time,
                        block_time:0,
                        nonce:res.nonce,
                        decimals:this.formData.decimals,
                        token:this.formData.symbol,
                        allGasFee,
                        type:'pending',
                        khazix:'khazix',
                        value:_value,
                        rpc:this.rpc
                    })
                }
            }catch(error){
                if(error.error && error.error.message){
                    if(error.error.message.indexOf('insufficient funds') > -1){
                        this.$message({
                            type:'error',
                            message:'insufficient funds for gas * price + value',
                            onClose:()=>{
                                this.isFetch = false
                            }
                        })
                    }else{
                        this.$message({
                            type:'error',
                            message:error.error && error.error.message,
                            onClose:()=>{
                                this.isFetch = false
                            }
                        })
                    }
                }
            }
        },
        async sendFil(){
            let balance = Number(this.formData.balance)
            let gas = (this.formData.gasFeeCap * this.formData.gasLimit) / Math.pow(10, 9)
            let fil = Number(this.formData.fil)
            if( fil + gas > balance) {
                this.$message.error(this.$t('sendFil.insufficientBalance'))
                return
            }
            let create_time =  parseInt(new Date().getTime() / 1000)
            if(this.formData.isMain === 1){
                this.isFetch = true
                try{
                    let address = this.address
                    let tx = {
                        from:address,
                        to:this.formData.to,
                        value:this.formData.fil,
                        privateKey:this.pkk,
                        nonce:this.maxNonce,
                        GasPremium: this.formData.gasPremium,
                        GasFeeCap: this.formData.gasFeeCap * Math.pow(10, 9),
                        GasLimit: Math.ceil(this.formData.gasLimit),
                    }

                    let MyGlobalApi = new GlobalApi()
                    MyGlobalApi.setRpc(this.rpc)
                    MyGlobalApi.setNetworkType(this.networkType)
                    let result = await MyGlobalApi.sendTransaction(tx)
                    let allGasFee = this.formData.gasFeeCap * this.formData.gasLimit * Math.pow(10, 9)
                    if(result && result.signed_cid){
                        let _value = this.formData.fil*Math.pow(10, Number(this.formData.decimals))
                        await this.db.addTable('messageList',{
                            signed_cid:result.signed_cid,
                            from:address,
                            to:this.formData.to,
                            create_time,
                            block_time:0,
                            nonce:result.nonce,
                            allGasFee,
                            decimals:this.formData.decimals,
                            token:this.formData.symbol,
                            type:'pending',
                            khazix:'khazix',
                            value:_value,
                            rpc:this.rpc
                        })
                    }
                }catch(err){
                    this.isFetch = false
                    console.log(err,'senFIl err')
                }
            }else{
                this.sendToken()
            }

            await this.db.deleteTable('addressRecordLast',{
                address:this.formData.to,
                rpc:this.rpc
            })
            await this.db.addTable('addressRecordLast',{
                address:this.formData.to,
                create_time,
                rpc:this.rpc,
                khazix:'khazix',
            })
            this.isFetch = false
            window.location.href = './wallet.html?fromPage=sendFil'
        },
    }
}
</script>

<style  lang="less" scoped>
.send-fil{
    width: 100%;
    height: 100%;
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
        .img{
            animation:turnX 3s linear infinite;
        }
        @keyframes turnX{
            0%{
                transform:rotateZ(0deg);
            }
            100%{
                transform:rotateZ(360deg);
            }
        }
    }
    /deep/.el-dialog{
        margin: 0 auto;
        &.is-fullscreen{
            border-radius: 0;
            .el-dialog__body{
                width: 100%;
                height: 100%;
            }
        }
    }
    /deep/.el-dialog__header{
        padding:0;
    }
    /deep/.el-dialog__body{
        padding: 0;
    }
    /deep/.el-dialog__footer{
        padding: 30px;
        border-top:1px solid #eee;
    }
}
</style>
