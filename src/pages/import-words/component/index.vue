<template>
    <layout @layoutMounted="layoutMounted">
        <div class="import-words">
            <kyBack @pageBack="back"></kyBack>
            <div class="title">{{$t('importWords.title')}}</div>
            <div class="sub-title">{{$t('importWords.subTitle')}}</div>
   
            <div class="input-item" :class="{error}">
                <kyInput 
                    :value="form.mnemonicWords" 
                    type="textarea"
                    :rows="3"
                    @focus="focus"
                    @changeInput="mnemonicWordsChange"
                >
                </kyInput>
            </div>
            <div class="error-tips" v-if="error">{{ $t('importWords.error') }}</div>
            <div class="tips" v-else>{{ $t('importWords.tips') }}</div>
            
            <div class="btn-wrap">
                <kyButton 
                    :type="'primary'" 
                    :active='active' 
                    @btnClick="importWallet"
                >
                    {{$t('importWords.btn')}}
                </kyButton>
            </div>
            <div class="loading" v-if="isFetch">
                <img :src="loading" alt="" class="img">
            </div>
        </div>
    </layout>
</template>

<script>
import { getQueryString,trimStr,getF1ByMne,enCodeMnePsd} from '@/utils'
import { MyGlobalApi } from '@/utils/api'
import layout from '@/components/layout'
import kyButton from '@/components/button'
import kyInput from '@/components/input'
import kyBack from '@/components/back'
import { mapState } from 'vuex'
import * as bip39 from 'bip39'
export default {
    data(){
        return{
            loading:require('@/assets/image/loading.png'),
            show:false,
            agree:false,
            isFetch:false,
            form:{
                mnemonicWords:'',
                accountName:'',
                password:''
            },
            error:false
        }
    },
    computed: {
        ...mapState('app',['rpc','networks','networkType','filecoinAddress0']),
        active(){
            let values = Object.values(this.form)
            let bol = values.every(n=>{
                return n !==  ''
            })
            return bol 
        },
    },
    components:{
        layout,
        kyInput,
        kyBack,
        kyButton
    },
    mounted(){
        let password = getQueryString('password')
        let accountName = decodeURIComponent(this.getQuery('accountName'))
        this.$set(this.form,'accountName',accountName)
        this.$set(this.form,'password',password)
    },
    methods:{
        async layoutMounted(){
        },
        async importWallet(){
            
            if(!this.active) return
            let mneWords = trimStr(this.form.mnemonicWords)
            let volid = bip39.validateMnemonic(mneWords)
            if(volid){
                this.isFetch = true
                this.error = false
                let f1 = await getF1ByMne(mneWords,this.form.password,this.networkType,this.filecoinAddress0)
                let { address,privateKey,digest } = f1
                let create_time =  parseInt(new Date().getTime() / 1000)
                // MyGlobalApi.setRpc(this.rpc)
                // MyGlobalApi.setNetworkType(this.networkType)
                // let res = await MyGlobalApi.getBalance(address)
                // let { balance,nonce } = res
                let accountName = this.form.accountName
                await window.filecoinwalletDb.accountList.add({
                    accountName,
                    address,
                    createType:'mnemonic',
                    privateKey,
                    create_time,
                    khazix:'khazix',
                    digest,
                    fil:0,
                    rpc:this.rpc
                })
                for (let n of this.networks){
                    if(n.rpc !== this.rpc){
                        let oF1 = await getF1ByMne(mneWords,this.form.password,n.networkType,n.filecoinAddress0)
                        // MyGlobalApi.setRpc(n.rpc)
                        // MyGlobalApi.setNetworkType(n.networkType)
                        // let oRes = await MyGlobalApi.getBalance(oF1.address)
                        // let { balance:oBanalce,nonce } = oRes
                        await window.filecoinwalletDb.accountList.add({
                            accountName,
                            address:oF1.address,
                            createType:'mnemonic',
                            privateKey:oF1.privateKey,
                            create_time,
                            khazix:'khazix',
                            digest:oF1.digest,
                            fil:0,
                            rpc:n.rpc
                        })
                    }
                }
                await window.filecoinwalletDb.activeAccount.where({khazix:'khazix'}).delete()
                await window.filecoinwalletDb.activeAccount.add({
                    address,
                    accountName,
                    privateKey,
                    create_time,
                    khazix:'khazix',
                    createType:'mnemonic',
                    fil:0,
                    digest,
                    rpc:this.rpc
                })
                
                let encode = await enCodeMnePsd(mneWords,this.form.password)
                let { mnemonic,password } = encode
                await window.filecoinwalletDb.walletKey.where({khazix:'khazix'}).delete()
                await window.filecoinwalletDb.walletKey.add({
                    mnemonicWords:mnemonic,
                    password,
                    rpc:this.rpc,
                    khazix:'khazix'
                })
                this.isFetch = false
                window.location.href = './wallet.html'
            }else{
                this.error = true
            }
            
        },
        focus(){
            console.log('this.error = false')
            this.error = false
        },
        mnemonicWordsChange(val){
            if(val === '') this.error = false
            this.$set(this.form,'mnemonicWords',val)
        },
        getQuery(name) { 
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
            var r = window.location.search.substr(1).match(reg);
            var context = ""; 
            if (r != null) 
                context = r[2]; 
            reg = null; 
            r = null; 
            return context == null || context == "" || context == "undefined" ? "" : context; 
        },
        back(){
            this.$router.go(-1)
        },
    }
}
</script>

<style  lang="less" scoped>
.import-words{
    width: 100%;
    margin: 0 auto;
    min-height: 100%;
    background: #fff;
    box-sizing: border-box;
    padding: 20px;
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
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        font-size: 18px;
        color: #222;
        cursor: pointer;
    }
    .title{
        color: #222;
        font-size: 18px;
        font-weight: bolder;
        padding: 30px 0 20px;
    }
    .sub-title{
        color: #222;
        font-size: 14px;
        margin-bottom: 10px;
    }
    .input-item{
        margin-bottom: 10px;
        &.error{
            /deep/.input-component{
                .el-textarea__inner{
                    border:1px solid #EA0F0F;
                }
            }
        }
        .label{
            font-size: 14px;
            color: #222;
            margin-bottom: 10px;
        }
    }
    .error-tips{
        font-size: 12px;
        color: #EA0F0F;
    }
    .tips{
        font-size: 12px;
        color: #6A6767;
    }
    .btn-wrap{
        padding-top: 280px;
    }
}
</style>
