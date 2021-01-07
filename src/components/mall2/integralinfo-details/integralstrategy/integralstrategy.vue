/**Created by dmj on 2018/1/3.*/

<template>
  <div class="integralstrategy">
    <nav-top title="成长攻略" @backEvent="$router.go(-1)"></nav-top>
    <nav-content v-if="integralstrategy">
       <div class="integralstrategy-info" v-html="integralstrategy.content"></div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "",
    components: {

    },
    data() {
      return {
        integralstrategy: []
      }
    },
    mounted() {
      this.getHeadlinesList()
    },
    methods: {
      getHeadlinesList() {
        // 获取头条信息接口
        let paramsData = {
          // token: this.$store.state.login.token,
          value: 10
        }
        this.$http.post('/app/json/news/getList', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.integralstrategy = data.data[0]
            console.log(this.integralstrategy)
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .integralstrategy-info {
    padding: 11px 15px
    overflow-y: auto;
    height: 100%;
    -webkit-overflow-scrolling touch
    line-height:20px;
  }
</style>
