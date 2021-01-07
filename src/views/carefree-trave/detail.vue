<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="产品详情"></nav-top>
    <nav-content>
      <div class="box" v-for="item in list">
        <div class="pic"><img :src="item.image?item.image:'static/image/microShop/lvyou.png'" alt=""></div>
        <div class="part1">
          <div class="div2">
            <div>￥<span>{{item.market_price}}</span>/人起</div>
          </div>
          <div class="div3">
            <span v-if="item.type==2">套票</span><span v-if="item.type==1">普通票</span><span v-if="item.type==3">线路</span>
            <span>{{item.goods_name}}</span>
          </div>
          <p class="p" v-html="item.title"></p>
          <div class="div4">
            <div v-if="buy"><i class="icon iconfont mall-dui"></i>随买随用</div>
            <div v-if="item.refund_type == 1"><i class="icon iconfont mall-dui"></i>可退票</div>
          </div>
        </div>
        <div class="part2" @click="todate">
          <div>
            <p>可定日期/套餐/价格：</p>
            <p>最晚08 : 00可预定出行当天产品</p>
          </div>
          <i class="icon iconfont mall-gengduojiantou"></i>
        </div>
        <div class="part3">
         <p><span>景区标题：</span><span>{{supperList.title}}</span></p>
          <p><span>景区地址:</span><span>{{supperList.address}}</span></p>
          <p><span>景区简介：</span><span>{{supperList.info}}</span></p>
        </div>
        <div class="part4">
          <van-tabs v-model="active">
            <van-tab title="产品详情">
             <p v-html="item.description"></p>
            </van-tab>
            <van-tab title="产品简介" v-html="item.brief"></van-tab>
            <van-tab title="购票须知" v-html="item.notice"></van-tab>
          </van-tabs>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import api from './api'
  export default {
    name: "detail",
    mixins: [api],
    data() {
      return {
        active: 1,
        list: [],
        supperList: {},
        buy: false,
        page: 0
      }
    },
    mounted() {
      this.loadData()
    },
    methods: {
      loadData() {
        let that = this
        that.page = that.page + 1
        let params = {
          token: this.$store.state.login.token,
          itemId: that.$route.query.id,
          pageThis: that.page,
          pageSize: 10,
          keyWord: ''
        };
        this.$Loading.open();

        that.ticketListData(params).then(res => {
          this.$Loading.close();
          if (res.data.result) {
           that.list = res.data.data || []
            that.supperList = res.data.data[0].supplier_list[0] || {}
            if (that.list.length>0) {
              that.list.forEach(function(item) {
                let time1 = item.startTime.substring(0,10)
                let time2 = that.getNowFormatDate()
                if (time1 == time2) {
                  that.buy = true
                }
              })
            }
          }
        });
      },
      getNowFormatDate() { //获取当前日期
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      },
      todate(params) {
        this.$router.push({
          path: '/carefree_trave/calendar',
          query: {
            itemId: this.$route.query.id,
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .body {
    background-color: #f6f6f6 !important;
  }
  .pic {
    img {
      width 100%
    }
  }
.part1 {
  background white
  padding 10px 20px
  .div2 {
    font-size: 14px;
    color: #dcb685;
    line-height: 30px;
    span {
      font-size: 24px;
      font-weight: 600;
    }
  }
  .div3 {
    width: 100%;
    margin-top 10px;
    span:nth-child(1) {
      border: 0.026667rem solid #ff9f5a;
      border-radius: 0.533333rem;
      color: #ff9f5a;
      width: auto;
      padding 0 6px
      height: 20px;
      text-align: center;
      line-height: 20px;
    }
    span:nth-child(2) {
      line-height 18px;
      font-size: 14px;
      margin: auto;
      margin-left: 10px;
    }
  }
  .div4 {
    display: flex;
    justify-content: start;
    line-height: 36px;
    height: 30px;
    border-top: 1px solid #efefef;
    color: #7c7c7c;
    margin-top: 15px;
    div:nth-child(1) {
      margin-right 15px;
    }
  }
  .p {
    color: #7c7c7c;
    line-height: 18px;
    margin-top 15px;
    span:nth-child(1) {
      margin-right 15px;
    }
  }
}
  .part2 {
     display: flex;
     justify-content: space-between;
     padding: 10px 20px;
     background: white;
     margin: 10px 0;
    div {
      p:nth-child(1) {
        font-size 16px;
      }
      p:nth-child(2) {
        font-size: 14px;
        margin-top: 10px;
        color #7c7c7c
      }
    }
    .iconfont {
      margin auto 0
    }
   }
    .part3 {
      padding: 10px 20px;
      background: white;
      margin-bottom 10px;
      font-size 16px;
      p {
        display: flex;
        justify-content: space-between;
        padding 7px 0
        span:nth-child(2) {
          color #7e7e7e
          font-size 14px
        }
      }
      p:nth-child(2) {
        margin 10px 0
      }
    }
  .part4 {
    padding: 10px 20px;
    background: white;
    margin-bottom 20px;
    p {
      margin-top: 20px;
      text-indent: 2em;
    }
    /deep/ .van-tab__pane img {
      width 100%
      display: flex;
      margin: 8px 0;
    }
  }
  /deep/ .iconfont {
    vertical-align: middle;
    margin-right: 5px;
  }
  /deep/ .nav-content {
    overflow-y auto !important
  }
  /deep/ .van-tabs__line {
    background-color: #ddb685;
  }
  /deep/ .van-tab__pane, .van-tab__pane-wrapper {
    margin-top 10px;
    line-height 22px;
  }
</style>
