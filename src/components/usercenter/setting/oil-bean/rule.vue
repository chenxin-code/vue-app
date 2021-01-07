<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="规则说明" />
    <nav-content>
       <div class="content">
         <div class="list-content" v-for="(item,index) in integralList" :key="index">
           <p class="titel">{{item.title}}</p>
           <span class="titel-content" v-html="item.content"></span>
         </div>
       </div>
    </nav-content>
  </div>
</template>
<script>
  export default {
    name: "rule",
    data() {
      return {
        integralList: []
      }
    },
    mounted() {
        let paramsData = {
          values: '12'
        }
        this.$http.post('/app/json/news/getNewsList', paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.integralList = data.data || []
          } else {
            this.$Toast(res.info)
          }
        })
    }
  }
</script>

<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .body {
    .content {
      width 100%
      margin 0 auto
      .list-content{
        margin 6px 8px
        padding 14px 10px
        border 1px solid #f1f1f1
        border-radius 7px
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1)
        font-size: $font-size-medium-x
        .titel{
          margin-bottom 8px
          color: $color-theme-r
          font-weight: $font-weight-x
        }
        .titel-content{
          color #584d4d
          line-height: 20px
        }
      }
    }
  }
</style>
