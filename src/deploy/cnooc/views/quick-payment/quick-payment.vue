<template>
  <div class="container">
    加载中···
  </div>
</template>
<script>
import cnoocUtil from '@/deploy/cnooc/utils'
export default {
  data () {
    return {
    }
  },
  mounted() {
    cnoocUtil.jumpCardSysPage(5, '/common')
  },
  methods: {
    // 获取卡系统token
    getCardToken() {
      this.$Loading.open()
      this.$http.post('/app/json/card/loadToken', {}).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.cardSysInfo = data.data || {}

          this.getAllCardNum()
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`loadToken err ${err}`)
      })
    },
    // 获取卡数量
    getAllCardNum() {
      this.$Loading.open()
      this.$http.post('/app/json/card/loadAllCardNum', {}).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          if (data.data > 0) {
            // 已经开卡 - 一键加油
            let targetUrl = `${cnoocConfig.cardBaseURL}/HykSite/v/user/onekeyrefuel/index?${this.dealwithPareStr({appType: 'APP', token: this.cardSysInfo.cardToken, userCode: this.cardSysInfo.userId, wxOpenId: this.cardSysInfo.wxOpenId}, this.cardSysInfo.key)}`
            console.log(`跳转地址： --- ${targetUrl} ---`)
            this.$bridgefunc.customPush({
              path: targetUrl,
              isnativetop: '0'
            })
          } else {
            // 无开卡信息 - 跳转开卡页面
            this.$bridgefunc.customPush({
              path: window.location.origin + '/site/app/#' + '/open-card?skip=1',
              isnativetop: '0',
            })
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`loadAllCardNum err ${err}`)
      })
    },
    // 编码卡系统连接参数
    dealwithPareStr(pare, key) {
      var pareArr = []
      for (var item in pare) {
        if (pare[item] === null || pare[item] === undefined || pare[item] === '') {
          continue
        }
        pareArr.push(item + '=' + pare[item])
      }
      var pareStr = pareArr.join('&')
      pareArr.push('key=' + key)
      var pareStrMd5 = pareArr.join('&')
      var sign = MD5(pareStrMd5)
      pareStr = pareStr + '&sign=' + sign.toUpperCase()
      return pareStr
    }
  }
}
</script>
<style lang="stylus" scoped>
  .container {
    font-size: 14px;
    color: #999;
    text-align: center;
    padding: 20px;
  }
</style>