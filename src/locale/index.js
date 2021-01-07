/**
 * Created by LiRui on 2019/6/26.
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './lang/zh'
import en from './lang/en'
import cookie from 'js-cookie'

Vue.use(VueI18n)
const navLang = navigator.language
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false
let lang = cookie.get('language') || localLang || 'zh-CN'
switch (lang) {
  case 'zh-CN':
    lang = 'zh'
    break
  case 'en-US':
    lang = 'en'
    break
}

const messages = {zh, en}
const i18n = new VueI18n({
  locale: lang,
  messages
})
export default i18n
