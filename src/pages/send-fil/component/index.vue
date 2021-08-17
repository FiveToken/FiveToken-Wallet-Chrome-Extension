<template>
    <layout @layoutMounted="layoutMounted">
        <div class="send-fil">
            <!-- <bHeader /> -->
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
// import bHeader from '@/components/header'
import stepOne from './step-1'
import stepTwo from './step-2'
import layout from '@/components/layout'
import { validatePassword,getPrivateKey,deCodeMnePsd,formatNumber} from '@/utils'
import { MyGlobalApi } from '@/utils/api'
import { BaseFeeAndGas } from '@/utils/fil-api'
import { mapMutations, mapState } from 'vuex'
import ABI from '@/utils/abi'
import { ethers } from 'ethers'
export default {
    data(){
        return{
            loading:require('@/assets/image/loading.png'),
            isFetch:false,
            step:1,
            price_currency:0,
            nonce:0,
            maxNonce:0,
            mnePsd:null,
            baseFeeCap:0,
            baseLimit:0,
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
            'symbol',
            'currency'
        ])
    },
    components:{
        stepOne,
        layout,
        stepTwo
    },
    async mounted(){
        let walletKey = await window.filecoinwalletDb.walletKey.where({khazix:'khazix'}).toArray()
        if(walletKey.length){
            let mnePsd = await deCodeMnePsd(walletKey[0].mnemonicWords,walletKey[0].password)
            this.mnePsd = mnePsd
        }
    },
    methods:{
        ...mapMutations('send-fil',[
            'SET_ACCOUNTLIST',
            'SET_ADDRESSBOOK',
            'SET_ADDRESSRECORDLAST',
            'SET_TOKENLIST'
        ]),
        async layoutMounted(){
            let recordLast = await window.filecoinwalletDb.addressRecordLast.where({ rpc:this.rpc }).toArray () || [];
            let myRecordLast = recordLast.filter(n=>{
                return n.address === this.address
            })
            this.SET_ADDRESSRECORDLAST(myRecordLast)
            let addressBook = await window.filecoinwalletDb.addressBook.where({ rpc:this.rpc }).toArray () || [];
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
            let list = await window.filecoinwalletDb.tokenList.where({ rpc:this.rpc,address:this.address }).toArray () || [];
            let tokenList = [
                {
                    rpc:this.rpc,
                    chainName:this.formData.chainName,
                    decimals:this.decimals,
                    symbol:this.symbol,
                    contract:'',
                    balance:this.formData.balance,
                    isMain:1
                }
            ]
            let provider = ethers.getDefaultProvider(this.rpc);
            list.forEach(async (n)=>{
                try{
                    let contract = new ethers.Contract(n.contract, ABI, provider);
                    contract.balanceOf(this.address).then(res=>{
                        let balance = res.toString()
                        let num = Number(balance) / Number(n.decimals)
                        tokenList.push(
                            {
                                ...n,
                                balance:num,
                                isMain:0
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
                        fil:0,
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
            let messageList = await window.filecoinwalletDb.messageList.where({ rpc:this.rpc }).toArray () || [];
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
            MyGlobalApi.setRpc(this.rpc)
            MyGlobalApi.setNetworkType(this.networkType)
            let res = await MyGlobalApi.getBalance(this.address)
            let { balance,nonce } = res
            console.log(balance,'balance res')
            let dec = balance / Math.pow(10,Number(this.decimals))
            let num = formatNumber(dec,12)
            this.$set(this.formData,'balance',num)
            this.nonce = nonce
            this.getNextNonce()
        },
        async getBaseFeeAndGas(from,to,nonce){
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
            MyGlobalApi.setRpc(this.rpc)
            MyGlobalApi.setNetworkType(this.networkType)
            let res = await MyGlobalApi.getPrice()
            let { usd,cny } = res
            if(this.currency === 'cny'){
                this.price_currency = cny
            }else{
                this.price_currency = usd
            }
        },
        next(){
            let balance = this.formData.balance
            // let gas = (this.formData.gasFeeCap * this.formData.gasLimit) / Math.pow(10, 9)
            let fil = Number(this.formData.fil)
            if( fil > balance){
                this.$message.error(this.$t('sendFil.insufficientBalance'))
            }else{
                if(this.formData.isAll === 1){
                    let fil = balance
                    this.$set(this.formData,'fil',fil)
                }
                this.step = 2
            }
        },
        async sendToken(){
            try{
                this.isFetch = true
                let { password } = this.mnePsd
                let privateKey = getPrivateKey(this.privateKey,this.address,password,this.networkType)
                let provider = ethers.getDefaultProvider(this.rpc);
                let wallet = new ethers.Wallet(privateKey, provider);
                let contractSigner = new ethers.Contract(this.formData.contract, ABI, wallet);

                let numberOfTokens = ethers.utils.parseUnits(this.formData.fil, this.formData.decimals);
                let allGasFee = this.formData.gasFeeCap * this.formData.gasLimit * Math.pow(10, 9)
                let res = await contractSigner.transfer(this.formData.to,numberOfTokens,{
                    gasPrice: this.formData.gasFeeCap * Math.pow(10, 9),
                    gasLimit: Math.ceil(this.formData.gasLimit),
                })
                if(res){
                    let create_time =  parseInt(new Date().getTime() / 1000)
                        await window.filecoinwalletDb.messageList.add({
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
                            value:this.formData.fil*Math.pow(10, Number(this.formData.decimals)),
                            rpc:this.rpc
                        })
                        await window.filecoinwalletDb.addressRecordLast.where({address:this.formData.to}).delete()
                        await window.filecoinwalletDb.addressRecordLast.add({
                            address:this.formData.to,
                            create_time,
                            rpc:this.rpc,
                            khazix:'khazix',
                        })
                        window.location.href = './wallet.html?fromPage=sendFil'
                }
                this.isFetch = false
            }catch(error){
                this.isFetch = false
                if(error.error && error.error.message){
                    this.$message({
                        type:'error',
                        message:error.error && error.error.message
                    })
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

            if(this.formData.isMain === 1){
                try{
                    this.isFetch = true
                    let address = this.address
                    let { password } = this.mnePsd
                    let privateKey = getPrivateKey(this.privateKey,address,password,this.networkType)
                    let tx = {
                        from:address,
                        to:this.formData.to,
                        value:this.formData.fil,
                        privateKey,
                        nonce:this.maxNonce,
                        GasPremium: this.formData.gasPremium,
                        GasFeeCap: this.formData.gasFeeCap * Math.pow(10, 9),
                        GasLimit: Math.ceil(this.formData.gasLimit),
                    }
                    MyGlobalApi.setRpc(this.rpc)
                    MyGlobalApi.setNetworkType(this.networkType)
                    let result = await MyGlobalApi.sendTransaction(tx)
                    
                    let allGasFee = this.formData.gasFeeCap * this.formData.gasLimit * Math.pow(10, 9)
                    if(result){
                        let create_time =  parseInt(new Date().getTime() / 1000)
                        await window.filecoinwalletDb.messageList.add({
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
                            value:this.formData.fil*Math.pow(10, Number(this.formData.decimals)),
                            rpc:this.rpc
                        })
                        await window.filecoinwalletDb.addressRecordLast.where({address:this.formData.to}).delete()
                        await window.filecoinwalletDb.addressRecordLast.add({
                            address:this.formData.to,
                            create_time,
                            rpc:this.rpc,
                            khazix:'khazix',
                        })
                       window.location.href = './wallet.html?fromPage=sendFil'
                    }
                    this.isFetch = false
                }catch(err){
                    console.log(err,'senFIl err')
                    this.isFetch = false
                }
            }else{
                this.sendToken()
            }
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
