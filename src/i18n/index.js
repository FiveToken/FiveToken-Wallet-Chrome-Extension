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

let locale = window.localStorage.getItem('filCurrentLang')

if(!locale){
  window.localStorage.setItem('filCurrentLang','en')
}

let i18n  = new VueI18n({
  locale: locale || 'en',
  messages,
  silentTranslationWarn: true
})

export default i18n

