<template>
<div class="import-wallet">
    <!-- <bHeader v-if="accountList.length"/> -->
    <div class="back" @click="back">
        <i class="el-icon-arrow-left"></i>
        <span>{{$t('importWallet.back')}}</span>
    </div>
    <div class="title">{{createType === 'words' ? $t('importWallet.title'):$t('importWallet.keyTitle')}}</div>
    <div class="sub-title" v-if="createType === 'words'">{{$t('importWallet.subTitle')}}</div>
    <div class="input-item" v-if="createType === 'words'">
        <div class="label">{{$t('importWallet.mnemonicWords')}}</div>
        <el-input v-model="form.mnemonicWords" v-if="!show" type="password" :placeholder="$t('importWallet.placeholder')"></el-input>
        <el-input v-model="form.mnemonicWords" v-else type="textarea" :rows="3"></el-input>
        <div class="check-box-wrap">
            <el-checkbox  v-model="show">{{$t('importWallet.showWords')}}</el-checkbox>
        </div>
    </div>
     <div class="input-item" v-else>
        <div class="label">{{$t('importWallet.privateKey')}}</div>
        <el-input v-model="form.phrase" type="textarea" :rows="3"> </el-input>
    </div>
    <div class="input-item">
        <div class="label">{{$t('importWallet.accountName')}}</div>
        <el-input v-model="form.accountName" max='24'> </el-input>
    </div>

    <div class="input-item">
        <div class="label">{{$t('importWallet.password')}}</div>
        <el-input v-model="form.password" type="password"></el-input>
    </div>

    <div class="input-item">
        <div class="label">{{$t('importWallet.confirmPassword')}}</div>
        <el-input v-model="form.confirmPassword" type="password"></el-input>
    </div>
    <el-checkbox v-model="agree">
        <div class="agree-wrap">
            <div class="text">{{$t('importWallet.agree')}}</div>
            <div class="clause" @click="toService">{{$t('importWallet.clause')}}</div>
        </div>
    </el-checkbox>
    <div class="btn-wrap">
      <el-button type="primary" :disabled='disabled' @click="importWallet">{{$t('importWallet.btn')}}</el-button>
    </div>
    <div class="loading" v-if="isFetch">
        <img :src="loading" alt="">
    </div>
</div>
</template>

<script>
import { genT1WalletByMne,genT1WalletByCK ,AESEncrypt} from '@/utils/f1'
import { privateKeyEncode,genPrivateKeyDigest ,privateKeyDecode,validatePrivateKey} from '@/utils/key'
import { debounce } from 'lodash'
import { getQueryString , trimStr} from '@/utils'
import { BalanceNonceByAddress } from '@/utils/api'
import aesjs from 'aes-js'
export default {
    data(){
        return{
            loading:require('@/assets/image/loading.png'),
            createType:'',
            show:false,
            agree:false,
            isFetch:false,
            form:{
                accountName:'',
                password:'',
                confirmPassword:'',
            },
        }
    },
    computed: {
        wordsType() {
            return this.show ? 'text' : 'password'
        },
        disabled(){
            let values = Object.values(this.form)
            let bol = values.every(n=>{
                return n !==  '' && this.agree
            })
            return !bol 
        },
    },
    async mounted(){
        this.createType = getQueryString('createType')
        if(this.createType === 'words'){
            this.$set(this.form,'mnemonicWords','')
        }else{
            this.$set(this.form,'phrase','')
        }
        let accountList = await window.filecoinwalletDb.accountList.where({ kunyao:'kunyao'}).toArray ()|| [];
        this.accountList = accountList
    },
    methods:{
        toService(){
            let lang = this.$i18n.locale
            lang = lang === 'zh' ? 'cn' : lang
            openUrl(`https://fivetoken.io/service?lang=${lang}`)
        },
        importWallet:debounce(async function(){
            if(this.form.password !== this.form.confirmPassword){
                this.$message.error(this.$t('importWallet.diffError'))
            }else{
                let reg = /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/
                let valid = reg.test(this.form.password)
                if(!valid){
                    this.$message.error(this.$t('importWallet.correctPassword'))
                }else{
                    this.isFetch = true
                    let f1
                    if(this.createType === 'words'){
                        f1 = this.getf1Mne()
                    }else{
                        f1 = this.getf1ByCK()
                        if(!f1){
                            this.isFetch = false
                            this.$message.error(this.$t('importWallet.importError'))
                            return
                        }
                    }
                    let { address,type,label,walletType,privateKey } = f1
                    console.log(f1,'456789')
                    let exist = this.accountList.some(n=>{
                        return n.address === address
                    })

                    console.log(exist,'exist')
                    if(exist){
                        this.isFetch = false
                        this.$message.error(this.$t('importWallet.exist')) 
                    }else{
                        let { accountName,password } = this.form
                        console.log(accountName,'accountName')
                        let digest = await genPrivateKeyDigest(privateKey)
                        console.log(digest,'digest')
                        let pk = privateKeyEncode(privateKey,address,this.form.password)
                        console.log(pk,'pk')
                        let create_time =  parseInt(new Date().getTime() / 1000)
                        BalanceNonceByAddress([{"address":address}]).then(async (result)=>{
                            this.isFetch = false
                            console.log(result,'BalanceNonceByAddress')
                            let res = result.data
                            let balance = 0
                            if(res && res.code === -32603){
                                balance = 0
                            }else{
                                balance = Number(res && res.balance || 0) / Math.pow(10, 18)
                            }
                            let AESmnemonicWords = AESEncrypt(this.form.mnemonicWords,privateKey)
                            await window.filecoinwalletDb.accountList.add({
                                accountName,
                                address,
                                type,
                                label,
                                walletType,
                                createType:this.createType,
                                privateKey:pk,
                                create_time,
                                kunyao:'kunyao',
                                digest,
                                mnemonicWords:AESmnemonicWords,
                                fil:balance
                            })
                            await window.filecoinwalletDb.activeAccount.where({kunyao:'kunyao'}).delete()
                            await window.filecoinwalletDb.activeAccount.add({
                                address,accountName,privateKey:pk,mnemonicWords:AESmnemonicWords,create_time,kunyao:'kunyao',fil:balance,digest
                            })
                            window.location.href = './create-success.html'
                        }).catch(async (err)=>{
                            this.isFetch = false
                            console.log(err,'BalanceNonceByAddressErr')
                        })  
                    }
                    
                       
                }
            }
        },300),
        getf1Mne(){
            let mne = this.form.mnemonicWords
            let f1 = genT1WalletByMne(mne,this.form.password,[])
            return f1
        },
        getf1ByCK(){
            try {
                let keyStore = JSON.parse(Buffer.from(trimStr(this.form.phrase), 'hex').toString())
                console.log(keyStore,'keyStorekeyStore')
                if(keyStore.Type === 'bls'){
                    return false
                }else{
                    let privateKey = keyStore.PrivateKey
                    let f1 = genT1WalletByCK(privateKey,this.form.password, [])
                    return f1
                }
            } catch (error) {
                this.isFetch = false
            }
            
        },
        back(){
            this.$router.go(-1)
        },
    }
}
</script>

<style  lang="less" scoped>
.import-wallet{
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
        margin-bottom: 30px;
    }
    .sub-title{
        color: #222;
        font-size: 14px;
        margin-bottom: 30px;
    }
    .input-item{
        margin-bottom: 20px;
        max-width: 320px;
        .label{
            font-size: 14px;
            color: #222;
            margin-bottom: 10px;
        }
        .check-box-wrap{
            padding-top: 10px;
        }
    }
    /deep/.el-checkbox{
        &.is-checked{
            .el-checkbox__label{
                color: #222;
            }
        }
        .agree-wrap{
            display: flex;
            align-items: center;
            .clause{
                color: #5CC1CB;
            }
        }
    }
    .btn-wrap{
        padding-top: 30px;
    }
}
</style>
