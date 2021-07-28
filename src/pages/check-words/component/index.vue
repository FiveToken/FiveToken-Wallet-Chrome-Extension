<template>
<div class="check-wallet">
    <!-- <bHeader /> -->
    <div class="back" @click="back">
        <i class="el-icon-arrow-left"></i>
        <span>{{$t('creatWallet.back')}}</span>
    </div>
    <div class="content">
        <div class="title">{{$t('checkWords.title')}}</div>
        <div class="sub-title">{{$t('checkWords.subTitle')}}</div>
        <div class="selected" v-if="selected.length">
            <div class="selected-item" v-for="(item,index) in selected" :key="index" @click="totgleWords(item)">
                <div class="index">{{index + 1}}</div>
                <div class="w">{{item}}</div>
                <div class="close"><i class="el-icon-close"></i></div>
            </div>
        </div>
        <div class="words-select">
            <div class="words-item" 
                v-for="(item,index) in mnemonicWords" :key="index" 
                @click="totgleWords(item)"
                :class="{active:selected.includes(item)}"
            >
                {{item}}
            </div>
        </div>
        <div class="btn-wrap">
            <el-button type="primary" :disabled='disabled' @click="confrim">{{$t('checkWords.btn')}}</el-button>
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
            selected:[],
            accountName:'',
            password:'',
            mnemonicWords:[]
        }
    },
    computed:{
        disabled(){
            return this.selected.length === 12 ? false : true
        }
    },
    mounted(){
        let accountName = decodeURIComponent(this.getQuery('accountName'))
        let password = getQueryString('password')
        let mnemonicWords = getQueryString('mnemonicWords').split(' ')
        this.accountName = accountName
        this.password = password
        this.mnemonicWords = this.shuffle(mnemonicWords)
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
        back(){
            let mnemonicWords = getQueryString('mnemonicWords')
            window.location.href = `./create-words.html?mnemonicWords=${mnemonicWords}&accountName=${this.accountName}&password=${this.password}`
            
        },
        totgleWords(words){
            const include = this.selected.includes(words)
            if(include){
                let index = this.selected.indexOf(words)
                this.selected.splice(index,1);
            }else{
                this.selected.push(words)
            }
        },
        shuffle(arr) {
            for (let i=arr.length-1; i>=0; i--) {
                let rIndex = Math.floor(Math.random()*(i+1));
                let temp = arr[rIndex];
                arr[rIndex] = arr[i];
                arr[i] = temp;
            }
            return arr;
        },
        async confrim(){
            let mnemonicWords = getQueryString('mnemonicWords')
            let mneArr = mnemonicWords.split(' ')
            let bol = this.arrayEquals(this.selected,mneArr)
            if(bol){
                this.isFetch = true
                let f1 = genT1WalletByMne(mnemonicWords,this.password,[])
                console.log(f1,'ffff1111111')
                let { address,type,label,walletType,privateKey } = f1
                let digest = await genPrivateKeyDigest(privateKey)
                let accountName = this.accountName
                let pk = privateKeyEncode(privateKey,address,this.password)
                let create_time =  parseInt(new Date().getTime() / 1000)
               
                let AESmnemonicWords = AESEncrypt(mnemonicWords,privateKey)
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
                    address,accountName,privateKey:pk,create_time,kunyao:'kunyao',fil:0,mnemonicWords:AESmnemonicWords,digest
                })
                window.location.href = './create-success.html'
                
            }else{
                console.log(this.$t('checkWords.checkError'))
                this.$message.error(this.$t('checkWords.checkError'))
            }
        },
        arrayEquals(array1,array2) {
            return array1.length == array2.length && array1.every(function(v,i) { return v === array2[i]});
        },
    }
}
</script>

<style  lang="less" scoped>
.check-wallet{
    width: 100%;
    margin: 0 auto;
    min-height: 100%;
    background: #fff;
    box-sizing: border-box;
    padding: 20px 10px 20px 20px;
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
        margin-bottom: 10px;
        font-size: 18px;
        color: #222;
        cursor: pointer;
    }
    .content{
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
        }
        .selected{
            border-radius: 10px; 
            margin-bottom: 20px;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            .selected-item{
                flex:0 0 calc((100% - 38px)/3);
                margin-right: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                margin-bottom: 10px;
                position: relative;
                cursor: pointer;
                &:nth-child(3n){
                    margin-right: 0;
                }
                .index{
                    position: absolute;
                    top:0px;
                    left:3px;
                    font-size: 12px;
                    color: #222;
                }
                .w{
                    height: 30px;
                    line-height: 30px;
                    color: #222;
                    font-weight: bolder;
                    text-align: center;
                }
                .close{
                    position: absolute;
                    top:0px;
                    right:3px;
                    font-size: 12px;
                    color: #222;
                }
            }
        }
        .words-select{
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            .words-item{
                flex:0 0 calc((100% - 38px)/3);
                height: 36px;
                line-height: 36px;
                color: #5CC1CB;
                border-radius: 3px;
                border:1px solid #5CC1CB;
                text-align: center;
                font-size: 16px;
                margin-bottom: 10px;
                margin-right: 10px;
                font-weight: bolder;
                cursor: pointer;
                &.active{
                    width: 0;
                    flex: 0 0 0;
                    border: none;
                    margin-right: 0;
                    display: none;
                }
            }
        }

       
    }
}
</style>
