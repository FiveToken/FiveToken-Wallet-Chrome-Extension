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
import { getQueryString,trimStr,getF1ByMne,setGlabolKek} from '@/utils'
import { genSalt,genKek,AESEncrypt } from '@/utils/key'
import layout from '@/components/layout'
import kyButton from '@/components/button'
import kyInput from '@/components/input'
import kyBack from '@/components/back'
import { mapMutations, mapState } from 'vuex'
import * as bip39 from 'bip39'
import { Database } from '@/utils/database.js';
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
        ...mapState('app',[
            'rpc',
            'networks',
            'networkType',
            'filecoinAddress0',
            'deriveIndex'
        ]),
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
        const db = new Database();
        this.db = db
    },
    methods:{
        ...mapMutations('app',[
            'SET_DERIVEINDEX'
        ]),
        async layoutMounted(){
        },
        async importWallet(){
            if(!this.active) return
            try{
                let mneWords = trimStr(this.form.mnemonicWords)
                let nospace = mneWords.replace(/\s+/ig," ")
                console.log(nospace,'nospace')
                let volid = bip39.validateMnemonic(nospace)
                if(volid){
                    this.isFetch = true
                    this.error = false
                    setTimeout(async ()=>{
                        let kek = genKek(this.form.password)
                        // let f1 = await getF1ByMne(mneWords,kek,this.networkType,this.filecoinAddress0,index)
                        let ethereumF1 = await getF1ByMne(nospace,kek,'ethereum','',0)
                        let filecoinF1 = await getF1ByMne(nospace,kek,'proxy','f',0)
                        let calibrationF1 = await getF1ByMne(nospace,kek,'proxy','t',0)
                        console.log(calibrationF1,filecoinF1,'calibrationF1')
                        let { address,privateKey,digest } = filecoinF1
                        let create_time =  parseInt(new Date().getTime() / 1000)
                        let accountName = this.form.accountName
                        this.SET_DERIVEINDEX(1)
                        await this.db.modifyTable(
                            'activenNetworks',
                            { rpc:this.rpc },
                            { deriveIndex:1 }
                        )
                        let _account = []
                        let _networks = []
                        for (let n of this.networks) {
                            let _index = n.deriveIndex + 1
                            if(n.filecoinAddress0 === 'f'){
                                _account.push({
                                    accountName,
                                    address:filecoinF1.address,
                                    createType:'mnemonic',
                                    privateKey:filecoinF1.privateKey,
                                    create_time,
                                    khazix:'khazix',
                                    digest:filecoinF1.digest,
                                    fil:0,
                                    isDelete:0,
                                    rpc:n.rpc
                                })
                            }else if(n.filecoinAddress0 === 't'){
                                _account.push({
                                    accountName,
                                    address:calibrationF1.address,
                                    createType:'mnemonic',
                                    privateKey:calibrationF1.privateKey,
                                    create_time,
                                    khazix:'khazix',
                                    digest:calibrationF1.digest,
                                    fil:0,
                                    isDelete:0,
                                    rpc:n.rpc
                                })
                            }else{
                                _account.push({
                                    accountName,
                                    address:ethereumF1.address,
                                    createType:'mnemonic',
                                    privateKey:ethereumF1.privateKey,
                                    create_time,
                                    khazix:'khazix',
                                    digest:ethereumF1.digest,
                                    fil:0,
                                    isDelete:0,
                                    rpc:n.rpc
                                })
                                
                                _networks.push({
                                    ...n,
                                    deriveIndex:1
                                })
                            }
                        }
                        await this.db.bulkAddTable('accountList',_account)
                        await this.db.bulkPutTable('networks',_networks)
                        await this.db.addTable('activeAccount',{
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
                        let salt = genSalt(this.form.password)
                        setGlabolKek(kek)
                        let mnemonic = AESEncrypt(mneWords,kek)
                        
                        await this.db.addTable('walletKey',{
                            mnemonicWords:mnemonic,
                            salt,
                            rpc:this.rpc,
                            khazix:'khazix'
                        })
                        this.isFetch = false
                        window.location.href = './wallet.html'
                    },0)
                }else{
                    this.error = true
                }
            }catch(error){
                console.log(error,'error')
            }
        },
        focus(){
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
