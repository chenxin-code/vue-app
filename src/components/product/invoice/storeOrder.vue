<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="便利店订单"></nav-top>
    <nav-content>
      <van-notice-bar :scrollable="true" v-if="$store.state.globalConfig.invoicePromptStatement">{{$store.state.globalConfig.invoicePromptStatement}}</van-notice-bar>
      <van-notice-bar :scrollable="true" v-else>可开票订单请尽量在{{$store.state.globalConfig.timeLimitInvoicing}}个月内自助开具发票！</van-notice-bar>
      <div class="publicInvoice" v-for="(item,index) in listData" :key="index" v-if="listData.length>0">
        <div class="operation">
          <div class="div1">
            <van-checkbox-group v-model="radioList" @change="selectData">
              <van-checkbox :name="item" checked-color="#F80F16"></van-checkbox>
            </van-checkbox-group>
            <span>订单号：{{item.shoppingOrderId}}</span>
          </div>
          <div>
            <div class="div2" v-for="(item1,index1) in item.itemAbstractList" :key="index1">
              <div class="div2Img">
                <img :src="item1.phPictureUrl" alt="">
              </div>
              <span>{{item1.skuName}}</span>
            </div>
            <div class="div3"><div>合计：<span>{{item.payAmount}}</span> 元</div>
            </div>
          </div>
        </div>
      </div>
      <div class="publicInvoice" v-if="listData.length==0">
        <div class="emptyDiv">
          <img src="static/image/invoice/p4@2x.png" alt="">
          <span>暂无订单记录！</span>
        </div>
      </div>
    </nav-content>
    <div class="summary" v-if="listData.length>0">{{radioList.length?radioList.length:0}} 个商品订单，总计 <span>{{totalMoney}}</span> 元，共<span> {{radioList.length}} </span>张发票</div>
    <div class="bottomTab" v-if="listData.length>0">
      <div class="left left1">
        <div class="img">
          <!--            <van-radio-group v-model="allRadio">-->
          <!--              <van-radio name="true"></van-radio>-->
          <!--            </van-radio-group>-->
          <van-checkbox checked-color="#F80F16" @click="allSelect" v-model="allRadio"></van-checkbox>
        </div>
        <div>
          <span>全选</span>
        </div>
      </div>
      <div class="left theme_bg_red right" @click="next">
        <div>
          <span>下一步</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from './api'
  import { formatDate } from '../../fuelcard/js/date.js'
  export default {
    name: "storeOrder",
    mixins: [api],
    data() {
      return {
        listData: [],
        show: false,
        radio: '1',
        radioList: [],
        allRadio: false,
        cardName: '',
        idArray: [],
        firstTime: '',
        lastTime: '',
        completeTime: '',
        totalMoney: 0,
        orderList: [],
      }
    },
    created() {
      this.time()
    },
    mounted() {
      this.loadIndex()
      console.log('月份',this.$store.state.globalConfig.timeLimitInvoicing)
    },
    methods: {
      loadIndex() {
        let that = this
        let params = {
          token: this.$store.state.login.token,
          orderType: 200002011,
          invoiceUse: 0,
          state: 3,
          completeTime: that.completeTime,
          // completeTime: ''
        };

        that.storeData(params).then(res => {
          console.log(res);
          if (res.data.result) {
            that.listData = res.data.data || []
          }
        });
      },
      selectData() {
        if (this.radioList.length == this.listData.length) {
          this.allRadio = true
        } else  if (this.radioList.length < this.listData.length) {
          this.allRadio = false
        }
        let that = this
        that.totalMoney = 0
        that.radioList.forEach(function(item) {
          console.log(item);
          that.totalMoney = Number((that.totalMoney + Number(item.payAmount)).toFixed(2))
        })
      },
      allSelect() {
        let that = this
        that.allRadio = !that.allRadio
        if (that.allRadio == true) {
          that.radioList = [] //清空
          that.listData.forEach(function(item) {
            that.radioList.push(item)
          })
        } else {
          that.radioList = []
        }
      },
      next() {
        let that = this
        that.idArray = []
        console.log(that.radioList);
        that.radioList.forEach(function(item) {
          that.idArray.push(item.id)
          that.orderList.push(item)
        })
        console.log(that.idArray);
        that.$router.push({
          path: '/openinvoiceDetail',
          query: {
            idArray: that.idArray, //所选的id集合
            orderList: JSON.stringify(that.orderList),
            totalMoney: that.totalMoney,
            type: 'storeOrder'
          }
        })
      },
      getPreMonthDay(date, monthNum) {
        let dateArr = date.split('-')
        let year = dateArr[0] //获取当前日期的年份
        let month = dateArr[1] //获取当前日期的月份
        let day = dateArr[2] //获取当前日期的日
        let days = new Date(year, month, 0)
        days = days.getDate() //获取当前日期中月的天数
        let year2 = year
        let month2 = parseInt(month) - monthNum
        if (month2 <= 0) {
          year2 =
            parseInt(year2) -
            parseInt(month2 / 12 == 0 ? 1 : Math.abs(parseInt(month2 / 12)) + 1)
          month2 = 12 - (Math.abs(month2) % 12)
        }
        let day2 = day
        let days2 = new Date(year2, month2, 0)
        days2 = days2.getDate()
        if (day2 > days2) {
          day2 = days2
        }
        if (month2 < 10) {
          month2 = '0' + month2
        }
        let t2 = year2 + '-' + month2 + '-' + day2
        return t2
      },
      getCurrentMonthLast() {
        var date = new Date()
        return date
      },
      format(fmt, date) {
        var o = {
          "M+": date.getMonth() + 1, // 月份
          "d+": date.getDate(), //日
          "h+": date.getHours(), //小时
          "m+": date.getMinutes(), //分
          "s+": date.getSeconds(), //秒
          "q+": Math.floor((date.getMonth() + 3) / 3), //季度
          "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      },
      time() {
        console.log(this.$store.state.globalConfig.gz_timeLimitInvoicing)
        let time2 = this.getCurrentMonthLast()
        let time = this.format('yyyy-MM-dd', time2)
        let datas = Number(this.$store.state.globalConfig.timeLimitInvoicing)
        let time1 = this.getPreMonthDay(time,datas)
       if (this.$store.state.globalConfig.gz_timeLimitInvoicing == 1) {
         this.firstTime = '20200314'.replace(/-/g,'')+'000000'
         this.lastTime = this.format('yyyyMMdd'+'235959', time2)
         this.completeTime = this.firstTime +'-'+ this.lastTime
       } else {
         this.firstTime = time1.replace(/-/g,'')+'000000'
        this.lastTime = this.format('yyyyMMdd'+'235959', time2)
        if (this.firstTime.length==14) {
          this.completeTime = this.firstTime +'-'+ this.lastTime
        } else {
          this.completeTime = ''
        }
       }
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .publicInvoice {
    box-shadow: #f3f3f3 0px 0px 15px;
    width: 95%;
    margin: 0 auto 10px auto;
    overflow: hidden;
    .emptyDiv {
      text-align center;
      font-size 16px;
      padding: 40px 0;
      img {
        width 200px;
        display block
        margin 0 auto
      }
    }
    .operation {
      width: 95%;
      margin: 0 auto;
      padding: 15px 0px 15px 0;
      /*border-bottom: 1px solid #ebedf0;*/
      .div1 {
        display flex
        justify-content start
        font-size 16px;
        span {
          margin auto 10px;
        }
      }
      .div2 {
        margin: 13px  0;
        font-size 16px;
        display flex;
        /*justify-content space-around*/
        img {
          width: 100px;
          vertical-align: top;
          margin-right: 20px;
        }
      }
      .div3 {
        display flex
        justify-content: flex-end;
        font-size 14px;
        color #9c9c9c
        span:nth-child(1) {
          margin 3px 10px 0 0;
        }
        div {
          span {
            font-size 18px;
            color #F80F16
          }
        }
      }
      .mall-jiantou {
        padding-left 30px;
        margin auto 0
        span {
          margin-top 7px;
          display inline-block
          font-size 16px;
          color:#F80F16
          font-weight 600
          margin-right 5px;
        }
      }

    }

    .te {
      border-bottom: none;
    }

    .maDiv {
      padding-bottom 10px;

      p {
        text-align: center;
        color: #787878;
        font-size 14px;
        margin-top: 0.3rem;
      }

      .ma {
        width: 150px;
        height: 150px;
        margin: 10px auto 10px auto;

        /deep/ .qrcode {
          width: 150px !important;
          height: 150px !important;
        }
      }
    }

    /deep/ .van-cell:not(:last-child)::after {
      right: 0.4rem;
    }

    .borDiv:not(:last-child)::after {
      border-bottom: 0;
    }

    .fa {
      /deep/ .van-field__control {
        text-align: right;
      }
    }

    .nei {
      /deep/ .van-field__control {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .selectCard {
    display: flex;
    justify-content: space-between;
    width: 95%;
    margin: 10px auto;
    line-height 30px;
    height 30px;
    span:nth-child(1) {
      margin-left 20px;
    }
    div {
      width: 70%;
      border: 1px solid #c9cbca;
      border-radius: 30px;
      display: flex;
      justify-content: space-between;
    }
    .iconfont {
      color #c9cbca!important
      margin-right 20px;
    }
  }
  /deep/ .van-radio-group {
    margin auto 0
  }
  /deep/ .van-checkbox-group {
    margin auto 0
  }
  /deep/ .nav-content {
    overflow-y auto !important;
    margin-bottom 95px;
  }
  .summary {
    position fixed;
    bottom 65px;
    left 0;
    height 30px;
    line-height 30px;
    color #9f9f9f
    font-size 15px;
    z-index 99
    width: 100%;
    text-indent: 0.7rem;
    background #fffbe8
    span {
      color #F80F16
    }
  }
  .bottomTab {
    /*border-top: 1px solid #ebedf0;*/
    position: fixed;
    height: 65px;
    line-height 71px;
    /*padding-top: 6px;*/
    text-align: center;
    bottom: 0;
    width: 100%;
    background: white;
    left: 0;
    display: flex;
    justify-content: space-between;
    .left {
      width: 50%;
      height: 100%;
      margin: auto;
      /*box-shadow: #eeeeee 0 0 0.4rem;*/
      font-size 16px;
      color black
      display: flex;
      width: 100%;
      display flex;
      justify-content center
      margin auto
    }

    .left1 {
      width: 50%;
      display flex;
      /*justify-content center*/
      margin auto;
      margin-left 20px;
      .img {
        width: 30px;
        display: block;
        margin-right 15px;
        img {
          width: 100%;
          vertical-align middle
        }
      }
      div {
        margin: auto 0;
      }
    }
    .right {
      color white
    }
  }

</style>
