<template>
  <div>
    <nav-top @backEvent="$router.go(-1)" title="我的约车"></nav-top>
    <nav-content>
      <p class="state">
        <span class="span1" v-if="cardDetail.useState == 1">预约成功</span>
        <span class="span1" v-if="cardDetail.useState == 2">已取消</span>
        <span class="span2">{{cardDetail.useTime}}</span>
      </p>
      <div class="box">
        <div class="route">
          <img src="./imgs/lu.png" alt />
          <div>
            <p><span class="circle"></span>线路起点
            <span class="place">{{cardDetail.useStartPlace}}</span></p>
            <p><span class="circle circle1"></span>线路终点
            <span class="place">{{cardDetail.useEndPlace}}</span></p>
          </div>
        </div>
        <div class="mingxi">
          <p>
            <span>用车人姓名</span>
            <span>{{cardDetail.userName}}</span>
          </p>
          <p>
            <span>用车人手机号</span>
            <span>{{cardDetail.userPhone}}</span>
          </p>
          <p>
            <span>用车时间</span>
            <span>{{cardDetail.useTime}}</span>
          </p>
          <p>
            <span>用车类型</span>
            <span>{{cardDetail.useType}}</span>
          </p>
          <p>
            <span>预约时间</span>
            <span>{{cardDetail.createTime}}</span>
          </p>
<!--          <p>-->
<!--            <span>预约状态</span>-->
<!--            <span>张三</span>-->
<!--          </p>-->
<!--          <p>-->
<!--            <span>取消时间</span>-->
<!--            <span>张三</span>-->
<!--          </p>-->
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cardDetail: {}
    };
  },
  mounted() {
      this.detail()
  },
  methods: {
      detail() {
          this.$http.post('/app/json/equity_member/queryEquityUseDetail', {id: this.$route.query.id}).then(res => { //详情
              let data = res.data
              if (data.status == 0) {
                  // this.cardDetail = {useStartPlace: '北京雍和宫',useState: 2, useEndPlace: '北京游乐园', serviceType: '约车',useTime: '2020-09-10'}
                  this.cardDetail = data.data || {}
              } else {
                  this.$Toast(res.data.info)
              }
          })
      }
  }
};
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
.state {
  line-height: 30px;
  font-size: 14px;
  width: 95%;
  margin: 0 auto;
  display flex
  padding 5px 0
  justify-content space-between
  border-bottom 1px solid #f2f2f2
  .span1 {
    background: #cb020d;
    color: #fff;
    padding: 0px 12px;
    border-radius: 15px;
  }
  .span2 {
    color #999999
  }
}

.box {
  width: 95%;
  margin: 0 auto 30px auto;
  font-size: 14px;

  .route {
    display: flex;
    justify-content: flex-start;
    padding: 15px 0;
    box-shadow: 0px 8px 8px -2px #f5ebec;

    img {
      width: 32px;
      height 32px
      margin auto 0
      margin-right: 15px;
    }

    div {
      display: flex;
      flex-direction: column;
      color #a6a6a6
      font-size 15px
      .circle {
        border: 3px solid #73be55;
        width: 10px;
        height: 10px;
        display: inline-block;
        margin-right 10px
        border-radius: 50%;
      }
      .circle1 {
        border: 3px solid #fa6a2f
      }
      .place {
        margin 5px 0 0 20px
        font-size 18px
        color black
        display flex
        word-break: break-all;
        word-wrap: break-word;
        line-height 24px
      }
      p:nth-child(1) {
        margin: 10px 0;
        padding-bottom 5px
        border-bottom 1px solid #f2f2f2
      }
    }
  }

  .mingxi {
    box-shadow: 0px 3px 12px #f5ebec;
    padding: 0 10px;
    margin-top 15px
    p {
      line-height: 45px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #f2f2f2;
    }
  }
}
</style>
