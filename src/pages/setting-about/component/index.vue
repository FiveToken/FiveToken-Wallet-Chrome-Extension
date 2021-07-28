<template>
<div class="setting-about">
    <div class="back">
         <i class="el-icon-arrow-left" @click="back"></i>
        <span>{{$t('settingAbout.about')}}</span>
        <i class="el-icon-close" @click="closeSetting"></i>
    </div>
     <div class="about-content">
       <div class="filecoinwallet">{{$t('settingAbout.filVersion')}}</div>
       <div class="version">{{version}}</div>
       <div class="tips">{{$t('settingAbout.tips')}}</div>
       <div class="link">{{$t('settingAbout.links')}}</div>
       <div class="privacy-policy" @click="toPrivacy">{{$t('settingAbout.privacy')}}</div>
       <div class="use-rule" @click="toService">{{$t('settingAbout.useRule')}}</div>
       <!-- <div class="contact-us">联系我们</div> -->

     </div>
</div>
</template>

<script>
export default {
    data(){
        return{
            version:''
        }
    },
    mounted(){

        this.version = window.localStorage.getItem('filecoinWalletVersion')
    },
    methods:{
        back(){
             window.location.href = './setting.html'
        },
        closeSetting(){
            window.location.href = './wallet.html'
        },
        toService(){
            let lang = this.$i18n.locale
            lang = lang === 'zh' ? 'cn' : lang
            openUrl(`https://fivetoken.io/service?lang=${lang}`)
        },
        toPrivacy(){
            let lang = this.$i18n.locale
            lang = lang === 'zh' ? 'cn' : lang
            openUrl(`https://fivetoken.io/private?lang=${lang}`)
        }
    }
}
</script>

<style  lang="less" scoped>
.setting-about{
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
    .about-content{
        padding: 0 20px;
        .filecoinwallet{
            font-size: 18px;
            color: #222;
            margin-bottom: 5px;
            line-height: 20px;
        }
        .version{
            font-size: 14px;
            color: #999;
            line-height: 17px;
            margin-bottom: 10px;
        }
        .tips{
            font-size: 14px;
            color: #999;
            line-height: 17px;
            margin-bottom: 20px;
        }
        .link{
            font-size: 18px;
            color: #222;
            margin-bottom: 5px;
            line-height: 20px; 
        }
        .privacy-policy{
            font-size: 14px;
            color: #3496DD;
            margin-bottom: 10px;
            cursor: pointer;
        }
        .use-rule{
            font-size: 14px;
            color: #3496DD;
            margin-bottom: 10px;
            cursor: pointer;
        }
        .contact-us{
            font-size: 14px;
            color: #3496DD;
            margin-bottom: 10px;
        }
    }
}
</style>
