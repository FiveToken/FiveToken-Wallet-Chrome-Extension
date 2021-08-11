<template>
    <layout>
        <div class="setting-currency">
            <div class="back">
                <i class="el-icon-arrow-left" @click="back"></i>
                <span>{{$t('settingCurrency.currency')}}</span>
                <i class="el-icon-close" @click="closeSetting"></i>
            </div>
            <div class="currency-content">
                <div class="transform">{{$t('settingCurrency.currencyConversion')}}</div>
                <div class="transform-select">
                    <el-select v-model="value">
                        <el-option
                        v-for="item in $t('settingCurrency.currencyArr')"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="language c">{{$t('settingCurrency.currentLanguage')}}</div>
                <div class="current-language">{{ langName }}</div>
                <div class="language-select">
                    <el-select v-model="lang" @change="selectChange" placeholder="">
                        <el-option
                        v-for="(item,index) in $t('settingCurrency.languageList')"
                        :key="index"
                        :label="item.langName"
                        :value="item.lang">
                        </el-option>
                    </el-select>
                </div>
                <div class="del-btn" @click="detelt">{{$t('settingCurrency.deleteAccount')}}</div>
            </div>
        </div>
    </layout>
</template>
<script>
import layout from '@/components/layout'
export default {
    data(){
        return{
            lang: '',
            langName:'',
            value:'usd',
            address:''
        }
    },
    components:{
        layout
    },
    async mounted(){
        // let currentLanguage = await window.filecoinwalletDb.currentLanguage.where({ khazix:'khazix'}).toArray ()|| [];
        let activeAccount = await window.filecoinwalletDb.activeAccount.where({ khazix:'khazix'}).toArray ()|| [];
        this.address = activeAccount.length && activeAccount[0].address
        let lang = 'zh'
        this.lang = lang
        this.langName = this.getLangName(lang)
        console.log(lang,this.$t('settingCurrency.languageList'),'currentLanguage')
    },
    methods:{
        getLangName(lang){
            let list = this.$t('settingCurrency.languageList')
            let langObj = list.length && list.find(n=>{
                return n.lang === lang
            })
            return langObj && langObj.langName || ''
        },
        back(){
            window.location.href = './setting.html'
        },
        closeSetting(){
            window.location.href = './wallet.html'
        },
        async selectChange(){

            window.localStorage.setItem('zh',this.lang)
            
            this.langName = this.getLangName(this.lang)
            this.$i18n.locale = this.lang
        },
        async detelt(){
            this.$confirm(this.$t('settingCurrency.deleteTips'), this.$t('settingCurrency.deleteTitle'), {
                confirmButtonText: this.$t('settingCurrency.confirm'),
                cancelButtonText: this.$t('settingCurrency.cancel'),
                type: 'warning'
            }).then(async () => {
                await window.filecoinwalletDb.activeAccount.where({khazix:'khazix'}).delete()
                await window.filecoinwalletDb.accountList.where({address:this.address}).delete()
                let accountList = await window.filecoinwalletDb.accountList.where({ khazix:'khazix'}).toArray () || [];
                if(accountList.length){
                    let first = accountList.filter((n,index)=>{
                        return index === 0
                    })
                    await window.filecoinwalletDb.activeAccount.bulkPut(first).then(res=>{
                        window.location.href = './wallet.html'
                    })
                }else{
                    window.location.href = './welcome.html'
                }
            }).catch(() => {
                       
            });  
        }
    }
}
</script>

<style  lang="less" scoped>

.setting-currency{
    width: 100%;
    margin: 0 auto;
    min-height: 100%;
    background: #fff;
    box-sizing: border-box;
    
    .back{
        display: flex;
        align-items: center;
        padding:  10px 20px;
        color: #222;
        border-bottom: 1px solid #eee;
        margin-bottom: 20px;
        justify-content: space-between;
        i{
            width: 35px;
            height: 35px;
            font-size: 18px;
            display: flex;
            align-items: center;
            cursor: pointer;
        }
        .el-icon-arrow-left{
            justify-content: flex-start;
        }
        .el-icon-close{
            justify-content: flex-end;
        }
        span{
            flex-grow: 1;
            font-size: 18px;
            text-align: left;
        }
    }
    .currency-content{
        padding: 10px 20px;
        .transform,.language{
            font-size: 14px;
            color: #222;
            margin-bottom: 20px;
            &.c{
                margin-bottom: 5px;
            }
        }
        .current-language{
            margin-bottom: 20px;
            font-size: 14px;
            color: #999;
        }
        .transform-select,.language-select{
            width: 200px;
            margin-bottom: 50px;
            /deep/.el-select{
                width:200px
            }
        }
        .del-btn{
            width: 200px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border:1px solid #C64345;
            color: #C64345;
            font-size: 14px;
            border-radius: 5px;
            cursor: pointer;
        }
    }
}
</style>
