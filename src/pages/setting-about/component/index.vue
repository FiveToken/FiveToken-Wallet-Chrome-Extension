<template>
    <layout>
        <div class="setting-about">
            <div class="back-wrap">
                <kyBack @pageBack="back" :name="$t('settingAbout.about')" :close="true" @pageClose="closeSetting"/>
            </div>
            <div class="about-content">
                 <div class="logo">
                    <img class="img" :src="logo" />
                </div>
                <div class="fivetoken">{{$t('settingAbout.filVersion')}}</div>
                <div class="version">{{$t('settingAbout.Version')}}{{version}}</div>
                <div class="tips">{{$t('settingAbout.tips')}}</div>
                <div class="privacy-policy" @click="toPrivacy">{{$t('settingAbout.privacy')}}</div>
                <div class="use-rule" @click="toService">{{$t('settingAbout.useRule')}}</div>
            </div>
        </div>
    </layout>
</template>

<script>
import layout from '@/components/layout'
import kyBack from '@/components/back'
import { fiveTokenVersion } from '@/utils'
import { openUrl } from '@/pages/popup/index.js'
export default {
  data () {
    return {
      logo: require('@/assets/image/logo.png'),
      version: ''
    }
  },
  components: {
    layout,
    kyBack
  },
  mounted () {
    this.version = fiveTokenVersion
  },
  methods: {
    back () {
      window.location.href = './setting.html'
    },
    closeSetting () {
      window.location.href = './wallet.html'
    },
    toService () {
      let lang = this.$i18n.locale
      lang = lang === 'zh' ? 'cn' : lang
      openUrl(`https://fivetoken.io/service?lang=${lang}`)
    },
    toPrivacy () {
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
    .back-wrap{
        padding: 15px 20px;
        border-bottom: 1px solid #eee;
    }
    .about-content{
        padding: 20px;
        .logo{
            width: 36px;
            height: 36px;
            margin: 0 auto 20px;
            .img{
                width: 36px;
                height: 36px;
            }
        }
        .fivetoken{
            font-size: 18px;
            color: #222;
            margin-bottom: 5px;
            line-height: 20px;
            text-align: center;
        }
        .version{
            font-size: 14px;
            color: #999;
            line-height: 17px;
            margin-bottom: 10px;
            text-align: center;
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
            color: #1C818A;
            margin-bottom: 10px;
            cursor: pointer;
        }
        .use-rule{
            font-size: 14px;
            color: #1C818A;
            margin-bottom: 10px;
            cursor: pointer;
        }
        .contact-us{
            font-size: 14px;
            color: #1C818A;
            margin-bottom: 10px;
        }
    }
}
</style>
