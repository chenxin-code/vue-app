<template>
  <div class="body">
    <nav-top title="加油支付凭证详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
       <div class="whiteBox">
         <div class="div div1">{{listObj.ouName}}</div>
         <div class="div">
           <div class="tag">实付金额</div>
           <p>￥{{listObj.payAmount}}</p>
         </div>
         <div class="div">
           <div class="tag tag1">TTC</div>
           <p>{{listObj.refuelPosTtc}}</p>
         </div>
         <div class="div">
           <div class="tag">加油卡号</div>
           <p>{{listObj.refuelCardNo}}</p>
         </div>
       </div>
       <div class="listBox">
         <div class="yellowBox">
           <div>加油时间</div>
           <p>{{listObj.completeTime}}</p>
         </div>
         <div class="yellowBox">
           <div>油枪</div>
           <p>{{listObj.refuelGunNo}}</p>
         </div>
         <div class="yellowBox">
           <div>油品</div>
           <p>{{listObj.refuelOilName}}</p>
         </div>
         <div class="yellowBox">
           <div>加油升数</div>
           <p>{{listObj.refuelLiter}}</p>
         </div>
         <div class="yellowBox">
           <div>加油金额</div>
           <p>￥{{listObj.payAmount}}</p>
         </div>
       </div>
    </nav-content>
  </div>
</template>

<script>
  import api from './api'
  export default {
    name: "vouchersDetail",
    mixins: [api],
    data() {
      return {
        listObj: {},
      }
    },
    mounted() {
      this.listObj = JSON.parse(this.$route.query.listObj)
    },
    methods: {

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  #app .router_class {
    background #f7f7f7;

    .whiteBox {
      .div {
        background white
        height 70px;
        font-size 16px;
        margin-top 16px;
        padding 0 0 5px 0
        position relative;

        .tag {
          width: 70px;
          height: 24px;
          background: #78a5f8;
          color: white;
          line-height: 24px;
          text-align: center;
          border-bottom-right-radius: 12px;
          font-size 14px;
        }

        .tag1 {
          color #b5dff1
        }

        p {
          text-align: center;
          font-size: 22px;
          font-weight: 600;
          position absolute;
          width 100%;
          left 0;
          bottom 10px;
        }
      }

      .div1 {
        line-height: 70px;
        text-align: center;
      }
    }

    .listBox {
      .yellowBox {
        line-height 50px;
        height 50px;
        background white
        margin-top 16px;
        font-size 16px;

        div {
          background #f2bb47;
          color white;
          width 90px;
          height 50px;
          text-align center
          float left;
          margin-right 20px;
        }

        p {
          float left
        }
      }
    }
  }

  /deep/ .nav-content {
    overflow-y auto !important
  }
</style>
