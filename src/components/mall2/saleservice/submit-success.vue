<template>
  <div class="submitsuccess">
    <nav-top @backEvent="$router.go(-3)"></nav-top>
    <nav-content>
      <div class="scroll-div">
        <div class="top-icon shadow-cell padding-con">
          <img class="suc-img" src="static/image/mall2/success.png"/>
          <p class="theme_font_common">您已成功提交，请耐心等待审核</p>
          <van-button
            color="#f80f16"
            class="back-btn"
            type="info"
            round
            @click="$router.go(-3)">返回</van-button>
        </div>
        <!--<div class="shadow-cell padding-con">-->
          <!--<div class="detail-info" v-for="order in datas">-->
            <!--<p class="left-title  theme_font_common ">{{order.title}}</p>-->
            <!--<p class="right-value theme_font_gray">{{order.value}}</p>-->
          <!--</div>-->
        <!--</div>-->
        <div class="recommend-div">
          <Recommend :deliverType="2"></Recommend>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import Recommend from '../list/recommend/index'

  export default {
    name: 'submitsuccess',
    components: {
      Recommend
    },
    data() {
      return {
        datas: [
          {
            title:'服务单号',
            value:'7654556'
          },{
            title:'服务类型',
            value:'退货'
          },{
            title:'退款金额',
            value:'￥46.00'
          },{
            title:'申请时间',
            value:'2018-10-31 12：25：18'
          }
        ]
      }
    },
    methods: {
      testFunc: function () {
        console.log('testFunc')
      }
    },
    created() {

    },
    beforeRouteLeave (to, from, next) {
      this.$keepaliveHelper.deleteCache(this)
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .submitsuccess{
    width 100%
    height 100%
    overflow hidden
    .back-btn {
      height 30px;
      line-height 30px;
      width 70%;
    }
    .scroll-div {
      position absolute;
      top 0px;
      bottom 0px;
      left 0px;
      right 0px;
      overflow-x hidden;
      overflow-y auto;
      -webkit-overflow-scrolling touch;
      background: url('../../../../static/image/mall2/list-bg.png') no-repeat center center / 100% 100%;
    }
    .top-icon{
      /*display flex*/
      text-align center
      img{
        width 115px
      }
      p{
        margin 20px 0px 10px;
        text-align center
        font-size $font-size-medium
        font-weight $font-weight-x
      }

    }
    .detail-info{
      display flex
      align-items center
      margin-top 19px
      .left-title{
        flex 1
        font-size $font-size-medium-s
      }
      .right-value{
        font-size $font-size-small
      }
    }

    .padding-con {
      padding 10px 10px
      .suc-img {
        width 60px;
      }
    }
    .recommend-div {
      overflow hidden;
    }
  }

</style>
