<template>
    <ky-layout>
        <div class="setting">
            <div class="top-nav">
                <ky-back :name="$t('setting.name')" @pageBack='back'/>
            </div>
            <div class="setting-content">
                <div class="menu">
                    <div class="menu-item" @click="currencyVisible = true">
                        <div class="link">
                            <div class="left">{{$t('setting.currency')}}</div>
                            <div class="right">
                                <div class="text">{{currencyName}}</div>
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                    <div class="menu-item" @click="languageVisible = true">
                        <div class="link">
                            <div class="left">{{$t('setting.language')}}</div>
                            <div class="right">
                                <div class="text">{{languageName}}</div>
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                    <div class="menu-item" v-for="(item,index) in $t('setting.menu')" :key="index">
                        <a class="link" :href="item.url">
                            <div class="left">{{ item.name }}</div>
                            <div class="right">
                                <div class="text" v-if="item.url === './setting-networks.html'">{{rpcName}}</div>
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
            :top="'38vh'"
        >
            <kyCurrency v-if="currencyVisible" @confirm="currencyChange" @close="currencyClose"/>
        </el-dialog>
        <el-dialog
            :visible.sync="languageVisible"
            width="300px"
            :show-close="false"
            :top="'30vh'"
        >
            <kyLanguage v-if="languageVisible" @confirm="languageChange" @close="languageClose"/>
        </el-dialog>
    </ky-layout>
</template>
<script>
import kyCurrency from './currency.vue'
import kyLanguage from './language.vue'
import { mapMutations, mapState } from 'vuex'
import ExtensionStore from '@/utils/local-store'
export default {
  components: {
    kyCurrency,
    kyLanguage
  },
  data () {
    return {
      createType: '',
      currencyVisible: false,
      languageVisible: false,
      localStore: null
    }
  },
  computed: {
    ...mapState('app', ['activeAccount', 'currency', 'language', 'rpcName']),
    currencyName () {
      let str = ''
      const obj = {
        usd: 'USD',
        cny: 'CNY'
      }
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(this.currency)) {
        str = obj[this.currency]
      }
      return str
    },
    languageName () {
      let str = ''
      const obj = {
        zh: '中文',
        en: 'English',
        ko: '한국어',
        ja: '日本語'
      }
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(this.language)) {
        str = obj[this.language]
      }
      return str
    }
  },
  async mounted () {
    const localStore = new ExtensionStore()
    this.localStore = localStore
    const activeAccount = this.activeAccount
    this.createType = activeAccount.createType
  },
  methods: {
    ...mapMutations('app', [
      'SET_CURRENCY',
      'SET_LANGUAGE',
      'SET_RPCNAME'
    ]),
    back () {
      window.location.href = './wallet.html'
    },
    currencyChange (val) {
      const currency = val.value
      this.SET_CURRENCY(currency)
      window.localStorage.setItem('fiveTokenCurrency', currency)
      this.currencyVisible = false
    },
    currencyClose () {
      this.currencyVisible = false
    },
    async languageChange (val) {
      const lang = val.value
      this.SET_LANGUAGE(lang)
      this.$i18n.locale = lang
      window.localStorage.setItem('fiveTokenLanguage', lang)
      this.languageVisible = false

      const defaultNetworks = this.$t('defaultNetworks')
      await this.localStore.set({ networks: defaultNetworks })
      if (defaultNetworks.length) {
        const _first = defaultNetworks[0]
        this.SET_RPCNAME(_first.name)
        await this.localStore.set({ activeNetwork: _first })
      }
    },
    languageClose () {
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
                position: relative;
                cursor: pointer;
                &:hover{
                    background: #f5f5f5;
                }
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
                        cursor: pointer;
                    }
                    .right{
                        cursor: pointer;
                        .text{
                            position: absolute;
                            right: 40px;
                            top: 50%;
                            transform: translateY(-50%);
                        }
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
