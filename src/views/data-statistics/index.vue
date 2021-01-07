<template>
  <div class="body">
    <nav-top title="数据统计" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content1">
        <div>
          <p>会员总览</p>
          <div class="overview">
            <div><div><span>昨日注册</span><span>1322</span></div><div><span>累计注册</span><span>312133</span></div></div>
            <div><div><span>昨日绑卡</span><span>231</span></div><div><span>累计绑卡</span><span>312133</span></div></div>
          </div>
        </div>
      </div>
      <div class="content1">
       <div>
         <p class="p1">运营中心</p>
         <div class="overview">
           <p class="p2">会员加油（元）</p>
           <div><div><span>昨日加油金额</span><span>1322</span></div><div><span>当月加油金额</span><span>312133</span></div></div>
         </div>
       </div>
        <div>
          <p class="p1">单位卡充值（万元）</p>
          <div class="overview">
            <p class="p2">会员加油（元）</p>
            <div class="thrediv"><div><span>昨日充值金额</span><span>1322</span></div><div><span>当月充值金额</span><span>312133</span></div><div><span>上月充值金额</span><span>312133</span></div></div>
          </div>
        </div>
        <div>
          <div class="overview">
            <p class="p2">商城交易（元）</p>
            <div><div><span>昨日销售金额</span><span>1322</span></div><div><span>当月销售金额</span><span>312133</span></div></div>
          </div>
        </div>
      </div>
      <div class="content1">
        <div>
          <p>APP日活</p>
          <div class="overview">
            <p class="p2">登陆人数</p>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "index"
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  #app .body {
    background #f6f6f6 !important
    .content1 {
      background white
      margin 20px 0
      padding-top 20px
      p {
        width 94%;
        margin 0 auto
        font-size 16px;
        font-weight  600
      }
      .p1 {
        border-bottom 1px solid #ede9e9
        padding-bottom 12px;
      }
      .p2 {
        text-align center
        margin-bottom 20px
      }
      .overview {
        width 94%
        padding 10px 0
        margin 20px auto
        div {
          display flex
          justify-content space-between
          div {
            width 46%
            height: 80px;
            margin 7px 0
            flex-direction: column;
            display: flex;
            box-shadow: 0 0 2px 0 rgba(180, 162, 162, 0.3);
            span {
              margin: auto;
              font-size 14px
            }
            span:nth-child(2) {
              color: #ff021a
              font-size 20px
              font-weight 600
            }
          }
        }
        .thrediv {
          div {
            width 30%;
          }
        }
      }
    }
    .content2 {
        background white;
        margin 20px 0;
        padding-top 20px
      p {
        width 94%;
        margin 0 auto
        font-size 16px;
        font-weight  600
      }
    }
  }
  .nav-content {
    overflow-y auto !important;
  }
</style>
