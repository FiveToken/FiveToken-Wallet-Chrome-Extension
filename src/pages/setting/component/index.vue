<template>
    <layout>
        <div class="setting">
            <div class="top-nav">
                <kyBack :name="$t('setting.name')" @pageBack='back'/>
            </div>
            <div class="setting-content">
                <div class="menu">
                    <div class="menu-item" @click="currencyVisible = true">
                        <div class="link">
                            <div class="left">{{$t('setting.currency')}}</div>
                            <div class="right">
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                    <div class="menu-item" @click="languageVisible = true">
                        <div class="link">
                            <div class="left">{{$t('setting.language')}}</div>
                            <div class="right">
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                    <div class="menu-item" v-for="(item,index) in $t('setting.menu')" :key="index">
                        <a class="link" :href="item.url">
                            <div class="left">{{ item.name }}</div>
                            <div class="right">
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            :visible.sync="currencyVisible"
            width="300px"
            :show-close="false"
            :close-on-click-modal="false"
            :top="'38vh'"
        >
            <kyCurrency v-if="currencyVisible" @confirm="currencyChange" @close="currencyClose"/>
        </el-dialog>
        <el-dialog
            :visible.sync="languageVisible"
            width="300px"
            :show-close="false"
            :close-on-click-modal="false"
            :top="'30vh'"
        >
            <kyLanguage v-if="languageVisible" @confirm="languageChange" @close="languageClose"/>
        </el-dialog>
    </layout>
</template>
<script>
import layout from '@/components/layout'
import kyBack from '@/components/back'
import kyCurrency from './currency.vue'
import kyLanguage from './language.vue'
import { mapMutations } from 'vuex'

export default {
    data(){
        return{
            createType:'',
            currencyVisible:false,
            languageVisible:false
        }
    },
    components:{
        layout,
        kyBack,
        kyCurrency,
        kyLanguage
    },
    async mounted(){
        let activeAccount = await window.filecoinwalletDb.activeAccount.where({ khazix:'khazix'}).toArray ();
        let createType = activeAccount.length && activeAccount[0].createType
        this.createType = createType
    },
    methods:{
        ...mapMutations('app',['SET_CURRENCY','SET_LANGUAGE']),
        back(){
            window.location.href = './wallet.html'
        },
        currencyChange(val){
            let currency = val.value
            this.SET_CURRENCY(currency)
            window.localStorage.setItem('fiveTokenCurrency',currency)
            this.currencyVisible = false
        },
        currencyClose(){
            this.currencyVisible = false
        },
        languageChange(val){
            let lang = val.value
            this.SET_LANGUAGE(lang)
            this.$i18n.locale = lang
            window.localStorage.setItem('fiveTokenLanguage',lang)
            this.languageVisible = false
        },
        languageClose(){
            this.languageVisible = false
        }
    }
}
</script>

<style  lang="less" scoped>
.setting{
    width: 100%;
    height: 100%;
    background: #fff;
    .top-nav{
        padding:15px 20px;
        border-bottom: 1px solid #eee;
    }
    .setting-content{
        display: flex;
        align-items: flex-start;
        .menu{
            width: 100%;
            .menu-item{
                width: 100%;
                height: 50px;
                line-height: 50px;
                border-bottom: 1px solid #eee;
                .link{
                    color: #222;
                    text-decoration: none;
                    padding:0 20px;
                    display: flex;
                    box-sizing: border-box;
                    .left{
                        flex-grow: 1;
                        font-size: 14px;
                        color: #222;
                        text-decoration: none;
                    }
                }
            }
        }
    }
}
/deep/.el-dialog{
    margin: 0 auto;
    border-radius: 10px;
}
/deep/.el-dialog__header{
    padding:0;
}
/deep/.el-dialog__body{
    padding: 0;
}
/deep/.el-dialog__footer{
    padding: 0;
}
</style>
