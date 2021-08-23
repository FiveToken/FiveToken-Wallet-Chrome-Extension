<template>
<div class="networks-form">
    <div class="back">
        <kyBack @pageBack="back" :name="$t('settingNetworks.addNetwork')"/>
    </div>
    <div class="add-networks">
        <div class="tips">{{$t('settingNetworks.addTips')}}</div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.networkName')}}</div>
            <kyInput :value="form.name" :disabled="form.disabled" @changeInput="changeForm(arguments,'name')"/>
        </div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.rpc')}}</div>
            <kyInput :value="form.rpc" :disabled="form.disabled" @changeInput="changeForm(arguments,'rpc')"/>
        </div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.chainID')}}</div>
            <kyInput :value="form.chainID" :disabled="form.disabled" @changeInput="changeForm(arguments,'chainID')"/>
        </div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.symbol')}}</div>
            <kyInput :value="form.symbol" :disabled="form.disabled" @changeInput="changeForm(arguments,'symbol')"/>
        </div>
        <div class="input-item">
            <div class="label">{{$t('settingNetworks.browser')}}</div>
            <kyInput :value="form.browser" :disabled="form.disabled" @changeInput="changeForm(arguments,'browser')"/>
        </div>
        <div class="btn-wrap">
            <kyButton @btnClick="back">{{$t('settingNetworks.cancel')}}</kyButton>
            <kyButton type="primary" :active="active" @btnClick="save">{{$t('settingNetworks.save')}}</kyButton>
        </div>
    </div>
    <div class="loading" v-if="isFetch">
        <img :src="loading" alt="" class="img">
    </div>
</div>
</template>

<script>
import kyBack from '@/components/back'
import kyInput from '@/components/input'
import kyButton from '@/components/button'
import { MyGlobalApi } from '@/utils/api'
import { getF1ByMne,getGlobalKek } from '@/utils'
import { AESDecrypt } from '@/utils/key'
import { mapState } from 'vuex'
export default {
    data(){
        return{
            form:{
                name:'',
                rpc:'',
                chainID:'',
                symbol:'',
                browser:'',
                disabled:false
            },
            loading:require('@/assets/image/loading.png'),
            isFetch:false,
            kek:'',
            mnemonicWords:''
        }
    },
    props:{
        detail:Object,
        pageType:String
    },
    watch:{
        detail:{
            handler(val){
                if(val){
                    this.$set(this.form,'disabled',val.disabled)
                }
            },
            deep:true,
            immediate:true
        }
    },
    computed:{
        ...mapState('app',[
            'networkType',
            'filecoinAddress0'
        ]),
        active(){
            return this.form.name !== '' && this.form.rpc !== '' && this.form.chainID !== '' && this.form.symbol !== '' && !this.form.disabled
        }
    },
    watch:{
        detail:{
            handler(newval,old){
                if(newval){
                    this.form = Object.assign({}, this.form, { ...newval })
                }
                console.log(newval,this,'newval')
            },
            immediate:true
        }
    },
    components:{
        kyBack,
        kyInput,
        kyButton
    },
    async mounted(){
        let kek = getGlobalKek()
        this.kek = kek
        let walletKey = await window.filecoinwalletDb.walletKey.where({khazix:'khazix'}).toArray()
        if(walletKey.length){
            let nme = walletKey[0].mnemonicWords
            let mnemonicWords = AESDecrypt(nme,kek)
            this.mnemonicWords = mnemonicWords
        }
    },
    methods:{
        back(){
            this.$emit("update:pageType",'list')
            // window.location.href = './setting.html'
        },
        async save(){
            if(this.active){
                this.isFetch = true
                MyGlobalApi.setRpc(this.form.rpc)
                MyGlobalApi.setNetworkType(this.networkType)
                let create_time =  parseInt(new Date().getTime() / 1000)
                let filRec = await MyGlobalApi.getFIleCoinChainHead(this.form.rpc)
                let ethRec = await MyGlobalApi.getBlockNumber(this.form.rpc)
                // this.SET_DERIVEINDEX(index) deriveIndex
                let index = this.detail.deriveIndex || 0
                if(filRec && filRec.networkType === 'filecoin'){
                    let { networkType,filecoinAddress0 } = filRec
                    await window.filecoinwalletDb.networks.put({
                        name:this.form.name,
                        rpc:this.form.rpc,
                        chainID:this.form.chainID,
                        symbol:this.form.symbol,
                        browser:this.form.browser,
                        disabled:false,
                        create_time,
                        networkType,
                        filecoinAddress0,
                        decimals:18,
                        image:'na.svg',
                        deriveIndex:index,
                        khazix:'khazix'
                    })
                    await this.addUser(networkType,filecoinAddress0,create_time)
                }else if(ethRec && ethRec.networkType === 'ethereum'){
                    let { networkType,filecoinAddress0 } = ethRec
                    await window.filecoinwalletDb.networks.put({
                        name:this.form.name,
                        rpc:this.form.rpc,
                        chainID:this.form.chainID,
                        symbol:this.form.symbol,
                        browser:this.form.browser,
                        disabled:false,
                        create_time,
                        networkType,
                        filecoinAddress0,
                        decimals:18,
                        image:'na.svg',
                        deriveIndex:index,
                        khazix:'khazix'
                    })
                    await this.addUser(networkType,filecoinAddress0,create_time)
                }else{
                    this.isFetch = false
                    this.$message.error(this.$t('settingNetworks.addError'))
                    return
                }
                this.isFetch = false
                window.location.href = './setting-networks.html'
            }
        },
        async addUser(networkType,filecoinAddress0,create_time){
            let rpcAccount = await window.filecoinwalletDb.accountList.where({rpc:this.form.rpc}).toArray() || []
            let index = this.detail.deriveIndex || 0
            let accountName = `Account` + (index + 1)
            let f1 = await getF1ByMne(this.mnemonicWords,this.kek,networkType,filecoinAddress0,index)
            let { address,privateKey,digest } = f1
            let res = await MyGlobalApi.getBalance(address)
            let { balance,nonce } = res
            await window.filecoinwalletDb.accountList.add({
                address,
                accountName,
                createType:'mnemonic',
                privateKey,
                fil:balance,
                create_time,
                khazix:'khazix',
                digest,
                rpc:this.form.rpc
            })
        },
        changeForm(args,key){
            if(args){
                this.$set(this.form,key,args[0])
            }
        }
    }
}
</script>

<style  lang="less" scoped>
.networks-form{
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
    .back{
        padding:15px 20px;
        border-bottom: 1px solid #F5F5F5;
        margin-bottom: 10px;
    }
    .add-networks{
        padding: 0 20px;
        .tips{
            background: #FDF8EB;
            border-radius: 5px;
            border:1px solid #F7E00A;
            font-size: 12px;
            color: #101010;
            padding: 10px 15px;
            margin-bottom: 15px;
        }

        .input-item{
            margin-bottom: 20px;
            .label{
                margin-bottom: 6px;
                font-size: 14px;
                color: #999;
            }
            .error{
                padding-top: 5px;
                font-size: 12px;
                color: #FD334C;
            }
        }
        .btn-wrap{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 15px;
            /deep/.button-wrap{
                width: 155px;
            }
        }
    }
}
</style>
