import Vue from "vue"
import VueI18n from "vue-i18n"
import en from "../lang/en"
import zh from "../lang/zh"
import ja from "../lang/ja"
import ko from "../lang/ko"
Vue.use(VueI18n)

const messages = {
  en: {
    ...en
  },
  zh: {
    ...zh
  },
  ja: {
    ...ja
  },
  ko: {
    ...ko
  }
}

let language = window.localStorage.getItem('fiveTokenLanguage')
let currency = window.localStorage.getItem('fiveTokenCurrency')
if(!language){
  window.localStorage.setItem('fiveTokenLanguage','zh')
}

if(!currency){
  window.localStorage.setItem('fiveTokenCurrency','usd')
}

let i18n  = new VueI18n({
  locale: language || 'zh',
  messages,
  silentTranslationWarn: true
})

export default i18n

