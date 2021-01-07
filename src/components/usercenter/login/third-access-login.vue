<template>
  <!--<div>{{showUrl}}</div>-->
  <div></div>
</template>
<script>
import userCenter from "../js/userCenter";
// import Config from '@/api/config'

export default {
  data() {
    return {
      showUrl: ''
    };
  },
  created() {

    /*
      timestamp:1578626811941
      appNo:thirdAccessLogin
      channel:100
      phone:13126967229
      clusterCode:YUSBUSER
      sign:307bdf8622910343beefd8051601e579
    */
    this.$http.post("/app/json/user/thirdAccessLogin", {
      timestamp: this.$route.query.timestamp,
      appNo: this.$route.query.appNo,
      channel: this.$route.query.channel,
      phone: this.$route.query.phone,
      clusterCode: this.$route.query.clusterCode,
      sign: this.$route.query.sign,
      authCode: this.$route.query.authCode,
    }).then(res => {
      let data = res.data;
      if (data.status == 0) {
        userCenter.saveLoginData(data.data);
        let pUrl = window.location.href
        let arr = pUrl.split('#')
        let baseUrl = arr[0]
        let url = baseUrl + '#' + data.data.redirectUrl
        this.showUrl = url
        window.location.replace(url)
        // this.$router.replace(data.data.redirectUrl);
      } else {
        this.$Toast(data.info);
      }
    }).catch(err => {
      this.$Toast(`thirdAccessLogin err ${err}`);
    });
  }
};
</script>
<style lang="stylus" scoped type="text/stylus"></style>
