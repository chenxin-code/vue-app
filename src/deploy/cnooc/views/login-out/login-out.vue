<template>
  <div></div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  created() {
    this.$Loading.open();
      let url = '/app/json/login/logout';
      let paramsData = {
        token: this.$store.state.login.token
      }
      this.$http.post(url, paramsData).then(res => {
          this.$Loading.close();
          console.log(res.data)
          let data = res.data;
          if (data.status == 0) {
            this.$userCenter.loginOut();
          } else {
            this.$Toast(data.info ? data.info : '登录失败')
          }
        },
        err => {
          this.$Loading.close();
          this.$Toast("系统运行过程中遇到问题，请稍候再试")
        }
      )
  }
}
</script>
<style lang="stylus" scoped type="text/stylus">
  
</style>