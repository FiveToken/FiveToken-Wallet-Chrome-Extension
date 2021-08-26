<template>
    <layout>
        <div class="create-words">
            <kyBack @pageBack="back"/>
            <div class="content">
                 <div class="title">{{$t('creatWords.title')}}</div>
                <div class="sub-title">{{$t('creatWords.subTitle')}}</div>
                <div class="mnemonic-words">
                    <div class="words-items" v-for="(item,index) in mnemonicArr" :key="index">
                        <div class="no">#{{index+1}}</div>
                        <div class="text">{{item}}</div>
                    </div>
                </div>
                <div class="copy copy-words" @click="copyWords" :data-clipboard-text="mnemonicWords">
                    {{$t('creatWords.copy')}}
                </div>
                <div class="tips">{{$t('creatWords.tips1')}}</div>
                <div class="tips">{{$t('creatWords.tips2')}}</div>
                <div class="btn-wrap">
                    <kyButton :type="'primary'" :active="active" @btnClick="next">{{$t('creatWords.btn1')}}</kyButton>
                    <kyButton @btnClick="skip">{{$t('creatWords.btn2')}}</kyButton>
                </div>
            </div>
            <div class="loading" v-if="isFetch">
                <img :src="loading" alt="" class="img">
            </div>
            <div class="mask" v-if="mask"></div>
        </div>
    </layout>
</template>

<script>
import ClipboardJS from 'clipboard'
import layout from '@/components/layout'
import kyButton from '@/components/button'
import kyBack from '@/components/back'
import { mapMutations, mapState } from 'vuex'
import { getQueryString,getF1ByMne,setGlabolKek } from '@/utils'
import { genSalt,genKek,AESEncrypt } from '@/utils/key'
import { Database } from '@/utils/database.js';
export default {
    data(){
        return{
            mask:false,
            active:true,
            loading:require('@/assets/image/loading.png'),
            isFetch:false,
            show:false,
            mnemonicWords:'',
            accountName:'',
            password:'',
            mnemonicArr:[],
            db:null
        }
    },
    components:{
        layout,
        kyBack,
        kyButton
    },
    computed:{
        ...mapState('app',[
            'rpc',
            'networks',
            'networkType',
            'filecoinAddress0',
            'deriveIndex'
        ])
    },
    async mounted(){
        let mnemonicWords = getQueryString('mnemonicWords')
        this.mnemonicWords = mnemonicWords
        let mnemonicArr = mnemonicWords.split(' ')
        this.mnemonicArr = mnemonicArr
        let accountName = this.getQuery('accountName')
        let password = getQueryString('password')
        this.accountName = decodeURIComponent(accountName)
        this.password = password

        const db = new Database();
        this.db = db
    },
    methods:{
        ...mapMutations('app',[
            'SET_DERIVEINDEX'
        ]),
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
        async skip(){
            this.isFetch = true
            try{
                setTimeout(async()=>{
                    let kek = genKek(this.password)
                    // let f1 = await getF1ByMne(this.mnemonicWords,kek,this.networkType,this.filecoinAddress0,index)
                    let ethereumF1 = await getF1ByMne(this.mnemonicWords,kek,'ethereum','',0)
                    let filecoinF1 = await getF1ByMne(this.mnemonicWords,kek,'proxy','f',0)
                    let calibrationF1 = await getF1ByMne(this.mnemonicWords,kek,'proxy','t',0)
                    let { address,privateKey,digest } = filecoinF1
                    let accountName = this.accountName
                    this.SET_DERIVEINDEX(1)
                    await this.db.modifyTable(
                        'activenNetworks',
                        { rpc:this.rpc },
                        { deriveIndex:1 }
                    )
                    let create_time =  parseInt(new Date().getTime() / 1000)
                    let _account = []
                    let _networks = []
                    for (let n of this.networks) {
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
                                rpc:n.rpc
                            })
                        }
                        _networks.push({
                            ...n,
                            deriveIndex:1
                        })
                        
                    }
                    await this.db.bulkAddTable('accountList',_account)
                    await this.db.bulkPutTable('networks',_networks)
                    await this.db.addTable('activeAccount',{
                        address,
                        accountName,
                        privateKey,
                        create_time,
                        khazix:'khazix',
                        rpc:this.rpc,
                        fil:0,
                        createType:'mnemonic',
                        digest
                    })

                    let salt = genSalt(this.password)
                    setGlabolKek(kek)
                    let mnemonic = AESEncrypt(this.mnemonicWords,kek)

                    await this.db.addTable('walletKey',{
                        mnemonicWords:mnemonic,
                        salt,
                        rpc:this.rpc,
                        khazix:'khazix'
                    })
                    
                    this.isFetch = false
                    window.location.href = './wallet.html'
                },0)
            }catch(error){
                console.log(error,'error')
            }
                
        },
        back(){
            window.location.href = './create-wallet.html?backPage=wallet'
        },
        copyWords(){
            this.mask = true
            let that = this
            const clipboard = new ClipboardJS('.copy-words')
            clipboard.on('success', function(e) {
                that.$message({
                    message: that.$t('creatWords.copySuccess'),
                    type: 'success',
                    duration:1500,
                    onClose:()=>{
                        that.mask = false
                    }
                });
            })
            clipboard.on('error', function(e) {})
        },
        next(){
            let accountName = encodeURIComponent(this.accountName)
            window.location.href = `./check-words.html?mnemonicWords=${this.mnemonicWords}&accountName=${accountName}&password=${this.password}`
        }
    }
}
</script>

<style  lang="less" scoped>
.create-words{
    width: 100%;
    margin: 0 auto;
    min-height: 100%;
    background: #fff;
    box-sizing: border-box;
    padding: 15px 20px;
    position: relative;
    .mask{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 999;
    }
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
        margin-bottom: 20px;
        font-size: 18px;
        color: #222;
        cursor: pointer;
    }
    .content{
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        padding: 30px 0 0;
        .title{
            color: #222;
            font-size: 20px;
            font-weight: bolder;
            margin-bottom: 20px;
        }
        .sub-title{
            color: #222;
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 20px;
        }
        .mnemonic-words{
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            .words-items{
                width: 100px;
                height: 30px;
                margin-right: 10px;
                margin-bottom: 15px;
                background: #F1F3FD;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                &:nth-child(3n){
                    margin-right: 0;
                }
                .text{
                    font-size: 14px;
                    color: #101010;
                }
                .no{
                    position: absolute;
                    top: 0px;
                    left: 3px;
                    color: #6A6767;
                    font-size: 12px;
                    transform: scale(.8);
                }
            }
        }
        .btn-wrap{
            display: flex;
            justify-content: space-between;
            padding-top: 80px;
            /deep/.button-wrap{
                width: 155px;
            }
        }
        .copy{
            font-size: 14px;
            color: #1C818A;
            margin-bottom: 15px;
            padding-top: 20px;
            cursor: pointer;
        }
        .tips{
            font-size: 12px;
            color: #6A6767;
            line-height: 20px;
        }
    }
}
</style>
