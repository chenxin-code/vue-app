<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="加油卡订单"></nav-top>
    <nav-content>
      <van-notice-bar :scrollable="true" v-if="$store.state.globalConfig.invoicePromptStatement">{{$store.state.globalConfig.invoicePromptStatement}}</van-notice-bar>
      <van-notice-bar :scrollable="true" v-else>可开票订单请尽量在{{$store.state.globalConfig.timeLimitInvoicing}}个月内自助开具发票！</van-notice-bar>
      <div class="selectCard" v-if="cardnoView">
        <span>选择卡号</span>
        <div @click="cards">
          <!--          <span>{{cardName || '请选择'}}</span>-->
          <span>{{cardName}}</span>
          <span class="iconfont mall-xialasanjiao"></span>
        </div>
      </div>
      <van-list v-model="loading" :finished="finished" finished-text="" @load="cardList">
        <div class="publicInvoice" v-for="(item,index) in listData" :key="index" v-if="listData.length>0">
          <div class="operation">
            <van-checkbox-group v-model="radioList" @change="selectData">
              <van-checkbox :name="item" checked-color="#F80F16"></van-checkbox>
            </van-checkbox-group>
            <div class="operationImg">
              <div class="titleContent">
                <span class="titleMessage">卡号：{{item.cardNo}}</span>
              </div>
              <div class="titleContent">
                <span class="titleMessage">{{item.opeTime}}</span>
              </div>
              <div class="titleContent">
                <span class="titleMessage">{{item.nodeName}}</span>
              </div>
            </div>
            <div class="mall-jiantou">
              <span class="span">{{item.actualAmount}}</span>元
            </div>
          </div>
        </div>
      </van-list>
      <div class="publicInvoice" v-if="listData.length==0">
        <div class="emptyDiv">
          <img src="static/image/invoice/p4@2x.png" alt="">
          <span>暂无订单记录！</span>
        </div>
      </div>
      <!--      <div class="publicInvoice" v-if="cardView">-->
      <!--        <div class="emptyDiv">-->
      <!--          <img src="static/image/invoice/p3@2x.png" alt="">-->
      <!--          <span>您还没有绑定加油卡，无法进行加油卡加油自助开票，请先绑定加油卡！</span>-->
      <!--        </div>-->
      <!--      </div>-->
    </nav-content>
    <!--    <div class="answer theme_bg_red" @click="commit">绑定加油卡</div>-->
    <div class="summary" v-if="listData.length>0">{{radioList.length?radioList.length:0}} 个加油订单，总计 <span>{{totalMoney}}</span> 元，共<span> {{radioList.length}} </span>张发票</div>
    <div class="bottomTab" v-if="listData.length>0">
      <div class="left left1">
        <div class="img">
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
    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="select"
    />
  </div>
</template>

<script>
  import api from "./api"
  import {Toast} from "vant";
  export default {
    name: "cardOrder",
    mixins: [api],
    data() {
      return {
        listData: [],
        show: false,
        radio: '1',
        radioList: [],
        allRadio: false,
        cardView: false,
        cardnoView: true,
        cardName: '',
        startTime: '',
        endTime: '',
        loading: false,
        finished: false,
        totalMoney: 0,
        nodeNo: '',
        orderList: [],
        actions: [
          {cardno: ''}
        ],
        page: 0,
        cardType: '',
      }
    },
    created() {
      this.time()
    },
    mounted() {
      console.log(this.$store.state.globalConfig.timeLimitInvoicing)
    },
    methods: {
      select(item) {
        console.log(item);
        this.nodeNo = item.nodeNo
        this.cardName = item.cardno
        this.cardType = item.cardType
        this.show = false
        this.finished = false
        this.listData = []
        this.page = 0
        this.loadIndex()
      },
      cardList() {
        let that = this
        let params = {
          token: this.$store.state.login.token,
          startTime: that.startTime,
          endTime: that.endTime
        };

        that.cardMoData(params).then(res => {
          if (res.data.result) {
            that.actions = res.data.data || []
            if (that.actions.length>0) {
              that.actions.forEach(function(item) {
                that.$set(item,"name",item.cardno);
              })
              that.cardName = that.actions[0].name
              that.nodeNo = that.actions[0].nodeNo
              this.cardType = that.actions[0].cardType
              that.loadIndex()
              if (that.actions.length !=0) {
                that.cardView = true
                that.show = false
              }
            } else {
              console.log('加油卡列表为空')
              that.loading = false
              that.finished = true
              that.cardnoView = false
            }
          }
        });
      },
      loadIndex() {
        let that = this
        that.page = that.page + 1
        let params = {
          token: this.$store.state.login.token,
          startTime: that.startTime,
          endTime: that.endTime,
          cardNo: that.cardName,
          needDetail: 1,
          pageNumber: that.page,
          pageSize: 10,
          invoiceUse: 0
        };

        that.loading = true
        that.cardData(params).then(res => {
          if (res.data.result === 'success') {
            let data = res.data.data.refuelingCardInfoLists || []
            that.listData = that.listData.concat(data) || []
            if (that.page >= res.data.data.page) {
              that.finished = true
            }
            if (that.listData.length==0) {
              that.finished = true
            }
          } else {
            that.finished = true
          }
          that.loading = false
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
          that.totalMoney = Number((that.totalMoney + Number(item.actualAmount)).toFixed(2))
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
        that.radioList.forEach(function(item) {
          that.idArray.push(item.id)
          that.orderList.push(item)
        })
        that.$router.push({
          path: '/openinvoiceDetail',
          query: {
            idArray: that.idArray, // 所选的id集合
            orderList: JSON.stringify(that.orderList),
            totalMoney: that.totalMoney,
            type: 'cardOrder',
            cardNo: that.cardName,
            cardType: that.cardType,
            startTime: that.startTime,
            endTime: that.endTime,
            nodeNo: that.nodeNo
          }
        })
      },
      onSelect(item) {
        let that = this
        that.show = false
        that.cardName = item.name
        that.finished = false
        that.page = 0
        that.loadIndex()
      },
      cards() {
        let that = this
        if(that.actions.length>0) {
          that.cardView = false,
            that.show = true
        }
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
      getCurrentMonthFirst() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() -2;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + month + strDate;
        return currentdate;
      },
      format(fmt, date) {
        var o = {
          "M+": date.getMonth() + 1, //月份
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
         let time2 = this.getCurrentMonthLast()
        let time = this.format('yyyy-MM-dd', time2)
        let datas = this.$store.state.globalConfig.timeLimitInvoicing ? Number(this.$store.state.globalConfig.timeLimitInvoicing) : 1
        console.log(datas);
        let time1 = this.getPreMonthDay(time,datas)
        if (this.$store.state.globalConfig.gz_timeLimitInvoicing == 1) {
           this.startTime = '20200314'.replace(/-/g,'')+'000000'
         this.endTime = this.format('yyyyMMdd'+'235959', time2)
        } else {
         this.startTime = time1.replace(/-/g,'')+'000000'
         this.endTime = this.format('yyyyMMdd'+'235959', time2)
        }
        // let time2 = this.getCurrentMonthLast()
        // let time = this.format('yyyy-MM-dd', time2)
        // let datas = Number(this.$store.state.globalConfig.timeLimitInvoicing)
        // console.log(datas);
        // let time1 = this.getPreMonthDay(time,datas)
        // console.log(time1);
        // this.firstTime = time1.replace(/-/g,'')+'000000'
        // this.lastTime = this.format('yyyyMMdd'+'235959', time2)
        // if (this.firstTime.length==14) {
        //   this.startTime = this.firstTime
        //   this.endTime = this.lastTime
        // } else {
        //   this.startTime = ''
        //   this.endTime = ''
        // }
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
      span {
        width: 80%;
        display: block;
        margin: 0 auto;
        line-height: 24px;
      }
    }
    .operation {
      width: 95%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      padding: 15px 0px 15px 0;
      /*border-bottom: 1px solid #ebedf0;*/

      .operationImg {
        line-height: 30px;
        display: flex;
        font-size: 14px;
        justify-content: space-between;
        flex-direction: column;
        flex: 1;
        margin-left: 10px;
        .titleMessage {
          font-size 16px;
        }

        .titleContent {
          display flex
          flex-direction: column;
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

      .operationSpan {
        padding: 0 15px;
        border-radius: 12px;
        color: #fff;
        line-height: 25px;
        height: 25px;
        font-size: 14px;
        display: inline-block;
      }

      .teDiv {
        line-height: 30px;
      }

      .operationDiv {
        line-height: 30px;
        /*height: 25px;*/
        font-size: 14px;

        span {
          margin: 0 6px;
          font-size 16px;
          color #787878
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
    margin-bottom 85px;
  }
  .summary {
    position fixed;
    bottom 50px;
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
    height: 50px;
    line-height 50px;
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

  .answer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: white;
    font-size: 18px;

    a {
      display: block;
      width: 100%;
      height: 50px;
      line-height: 50px;
      color: white;
      font-size: 18px;
    }
  }
</style>
