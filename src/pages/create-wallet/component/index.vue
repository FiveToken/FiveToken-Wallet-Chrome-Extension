<template>
<div class="import-wallet">
    <!-- <bHeader /> -->
    <div class="back" @click="back">
        <i class="el-icon-arrow-left"></i>
        <span>{{$t('creatWallet.back')}}</span>
    </div>
    <div class="title">{{$t('creatWallet.title')}}</div>

    <div class="input-item">
        <div class="label">{{$t('creatWallet.accountName')}}</div>
        <el-input v-model="form.accountName" max='24'></el-input>
    </div>

    <div class="input-item">
        <div class="label">{{$t('creatWallet.password')}}</div>
        <el-input v-model="form.password" type="password"></el-input>
    </div>

    <div class="input-item">
        <div class="label">{{$t('creatWallet.confirmPassword')}}</div>
        <el-input v-model="form.confirmPassword" type="password"></el-input>
    </div>
    <el-checkbox v-model="agree">
        <div class="agree-wrap">
            <div class="text">{{$t('creatWallet.agree')}}</div>
            <div class="clause" @click="toService">{{$t('creatWallet.clause')}}</div>
        </div>
    </el-checkbox>
    <div class="btn-wrap">
      <el-button type="primary" :disabled='disabled' @click="create">{{$t('creatWallet.btn')}}</el-button>
    </div>
</div>
</template>

<script>
import { debounce } from 'lodash'
import * as bip39 from 'bip39'
import { getQueryString } from '@/utils'
export default {
    data(){
        return{
            show:false,
            agree:false,
            form:{
                accountName:'',
                password:'',
                confirmPassword:''
            }
        }
    },
    computed: {
        type() {
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
    mounted(){
        
    },
    methods:{
        toService(){
            let lang = this.$i18n.locale
            lang = lang === 'zh' ? 'cn' : lang
            openUrl(`https://fivetoken.io/service?lang=${lang}`)
        },
        create(){
            if(this.form.password !== this.form.confirmPassword){
                this.$message.error(this.$t('creatWallet.diffError')) 
                console.log(this.$t('creatWallet.diffError'))
            }else{
                let reg = /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/
                let valid = reg.test(this.form.password)
                if(!valid){
                    this.$message.error(this.$t('creatWallet.correctPassword'))
                }else{
                    // get mnemonicWords
                    let mnemonicWords = this.genMnemonic()
                    let trim = this.form.accountName.replace(/(^\s*)|(\s*$)/g, "")
                    let accountName = encodeURIComponent(trim)
                    let de = decodeURIComponent(accountName)
                    console.log(de,'decodeURIComponent')
                    window.location.href = `./create-words.html?accountName=${accountName}&password=${this.form.password}&mnemonicWords=${mnemonicWords}`
                }
            }
        },
        genMnemonic() {
            return bip39.generateMnemonic()
        },
        back(){
            let backPage = getQueryString('backPage')
            if(backPage === 'wallet'){
                window.location.href = './wallet.html'
            }else{
                 window.location.href = './first-wallet.html'
            }
        }
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
            .text{
                margin-right: 5px;
            }
        }
        .clause{
            color: #5CC1CB;
        }
    }
    .btn-wrap{
        padding-top: 30px;
    }
}
</style>
