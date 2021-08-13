<template>
<div class="create-words">
    <!-- <bHeader /> -->
    <div class="back" @click="back">
        <i class="el-icon-arrow-left"></i>
        <span>{{$t('creatWallet.back')}}</span>
    </div>
    <div class="content">
        <div class="left">
            <div class="title">{{$t('creatWords.title')}}</div>
            <div class="sub-title">{{$t('creatWords.subTitle1')}}</div>
            <div class="sub-title">{{$t('creatWords.subTitle2')}}</div>
            <div class="secret-language">
                <div class="posttion" v-if="mask" @click="mask = false">
                    <div class="icon"><i class="el-icon-lock"></i></div>
                    <div class="text">{{$t('creatWords.showWords')}}</div>
                </div>
                <div class="words" :class="{active:!mask}">{{mnemonicWords}}</div>
            </div>
            <div class="btn-wrap">
                <el-button type="primary" plain @click="skip">{{$t('creatWords.btn1')}}</el-button>
                <el-button type="primary" :disabled='mask' @click="next">{{$t('creatWords.btn2')}}</el-button>
            </div>
        
        </div>
        <div class="right">
            <div class="tips">{{$t('creatWords.tips')}}</div>
            <div class="info">{{$t('creatWords.tipsInfo')}}</div>
        </div>
    </div>
    <div class="loading" v-if="isFetch">
            <img :src="loading" alt="">
        </div>
</div>
</template>

<script>
import { getQueryString } from '@/utils'

import { genT1WalletByMne,AESEncrypt } from '@/utils/f1'
import { privateKeyEncode ,genPrivateKeyDigest} from '@/utils/key'
import { BalanceNonceByAddress } from '@/utils/api'
export default {
    data(){
        return{
            loading:require('@/assets/image/loading.png'),
            isFetch:false,
            show:false,
            mnemonicWords:'',
            mask:true,
            accountName:'',
            password:'',
            accountList:[]
        }
    },
    async mounted(){
        let mnemonicWords = getQueryString('mnemonicWords')
        this.mnemonicWords = mnemonicWords
        let accountName = this.getQuery('accountName')
        let password = getQueryString('password')
        this.accountName = decodeURIComponent(accountName)
        this.password = password
    },
    methods:{
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
            // generate address
            let f1 = genT1WalletByMne(this.mnemonicWords,this.password,[])
            let { address,type,label,walletType,privateKey } = f1
            // get digest
            let digest = await genPrivateKeyDigest(privateKey)
            let accountName = this.accountName
            // encode privateKey
            let pk = privateKeyEncode(privateKey,address,this.password)
            let create_time =  parseInt(new Date().getTime() / 1000)
            let AESmnemonicWords = AESEncrypt(this.mnemonicWords,privateKey)
            // store account
            await window.filecoinwalletDb.accountList.add({
                accountName,
                address,
                mnemonicWords:AESmnemonicWords,
                type,
                label,
                walletType,
                createType:'create',
                privateKey:pk,
                create_time,
                kunyao:'kunyao',
                digest,
                fil:0
            })
            await window.filecoinwalletDb.activeAccount.where({kunyao:'kunyao'}).delete()
            await window.filecoinwalletDb.activeAccount.add({
                address,
                accountName,
                privateKey:pk,
                create_time,
                kunyao:'kunyao',
                fil:0,
                mnemonicWords:AESmnemonicWords,
                digest
            })
            window.location.href = './create-success.html'
        },
        back(){
            window.location.href = './create-wallet.html?backPage=wallet'
        },
        next(){
            let accountName = encodeURIComponent(this.accountName)
            let url = `./check-words.html?mnemonicWords=${this.mnemonicWords}&accountName=${accountName}&password=${this.password}`
            window.location.href = url
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
        .left{
            margin-bottom: 20px;
            .title{
                color: #222;
                font-size: 28px;
                font-weight: bolder;
                margin-bottom: 10px;
            }
            .sub-title{
                color: #222;
                font-size: 16px;
                margin-bottom: 20px;
                line-height: 20px;
            }
            .secret-language{
                width: 100%;
                border-radius: 10px;
                position: relative;
                border: 1px solid #eee;
                .words{
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-sizing: border-box;
                    font-size: 18px;
                    text-align: center;
                    color: rgba(102,102,102,0.1);
                    &.active{
                        color: #222;
                    }
                }
                .posttion{
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: #fff;
                    cursor: pointer;
                    z-index: 9;
                    .icon{
                        margin-bottom: 20px;
                        /deep/.el-icon-lock{
                            font-size: 28px;
                        }
                    }
                    .text{
                        font-size: 16px;
                    }
                }
            }
            .btn-wrap{
                padding-top: 30px;
            }
        }
        .right{
            flex: 0 0 35%;
            color: #222;
            font-size: 16px;
            line-height: 20px;
            .tips,.info{
                margin-bottom: 20px;
            }
        }
    }
}
</style>
