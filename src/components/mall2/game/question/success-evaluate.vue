<template>
    <div class="body">
      <nav-top title="参与成功" @backEvent="$router.go(-1)">
      </nav-top>
      <nav-content>
        <div class="content">
          <div>
            <div class="img-con">
              <!--            <div class="img"></div>-->
              <img src="static/image/mall2/thanks.png" alt="" >
            </div>
<!--            <p class="p1">评价已提交</p>-->
            <div class="con" >
              感谢您的评价，我们将持续改进与提升！
            </div>
          </div>
          <SubPage :divKeywords="'ServiceEvaluationSuccess'"></SubPage>
<!--          <div class="item" v-if="$store.state.globalConfig.evaluate_show">-->
<!--            <div class="con" >-->
<!--              如果还有其他宝贵意见请移步吐槽墙，请点击下方图片前往参与吐槽，我们将积极采纳您得意见建议！-->
<!--            </div>-->
<!--            <div class="img-con1" @click="enterTucao">-->
<!--              <img src="static/image/mall2/tucao.png" alt="" >-->
<!--            </div>-->
<!--          </div>-->
        </div>
      </nav-content>
    </div>
</template>
<script>
  import SubPage from '@/components/product/index/subpage/subpage'

  export default {
        name: "",
        components: {
          SubPage
        },
        data() {
            return {

            }
        },
        methods: {
          // enterTucao(){
          //
          //   this.$router.push({
          //     path: '/evaluate',
          //     query:{
          //       id:this.$store.state.globalConfig.evaluate_show,
          //       ouCode:'100',
          //       serviceType:3,
          //       storeName:'河北石油分公司'
          //
          //     }
          //   })
          // }
        }
    }
</script>

<style lang="stylus" scoped>
  .con{
    font-size 14px
  }
  .p1{
    font-weight: 500;
    font-size: 24px
    padding 5px
  }
  .img-con{
    width 150px
    height 150px
    margin  0 auto
    /*display flex*/
    /*justify-content center*/
    /*align-items center*/
    img{
      max-width 100%
      max-height 100%
      display block
      margin 0 auto
    }
    .img{
      background url("../../../../../static/image/mall2/submit.png") center center no-repeat
      background-size contain
      width 100px
      height 100px
    }
  }
  .img-con1{
    margin  10px auto
    /*display flex*/
    /*justify-content center*/
    /*align-items center*/
    img{
      max-width 100%
      max-height 100%
      display block
      margin 0 auto
    }
    .img{
      background url("../../../../../static/image/mall2/submit.png") center center no-repeat
      background-size contain
      width 100px
      height 100px
    }
  }
  .body {
    position relative;
    .shareBox {
      float right;
      display: flex;
      margin-right 10px;
      justify-content: space-around;
      position relative;
      z-index 10
      .name {
        margin-right 10px;
        font-size 14px;
      }
    }
    .content {
      text-align: center;
      line-height: 30px;
      width: 90%;
      margin: 10px auto 0 auto;
      font-size: 18px;
    }
    .answer {
      position fixed;
      bottom 0;
      left 0;
      width 100%;
      height 50px;
      line-height 50px;
      text-align center;
      color white;
    }
  }
  .item{
    margin-top 10px
  }
</style>
