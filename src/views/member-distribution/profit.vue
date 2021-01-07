<template>
  <div class="body">
    <nav-top :bgImg="bg" @backEvent="$router.go(-1)" title="我的销量">
      <div class="shareBox"></div>
    </nav-top>
    <nav-content>
      <!-- <div v-if="$store.state.webtype != 3">
        <div class="divs">
          <div>
            <p>累积收益</p>
          </div>
          <router-link
            :to="{name:'member_distribution/profitDetail',params:{type: 3}}"
            v-if="profitObj.integralWay == 1"
          >
            <div>
              <p>收益积分</p>
              <p>
                <span>{{profitObj.integralAccounted}}</span>积分
                <span class="iconfont mall-gengduojiantou"></span>
              </p>
            </div>
          </router-link>
          <router-link
            :to="{name:'member_distribution/profitDetail',params:{type: 8}}"
            v-if="profitObj.oilWay == 1"
          >
            <div>
              <p>油滴</p>
              <p>
                <span>{{profitObj.oilAccounted}}</span>升
                <span class="iconfont mall-gengduojiantou"></span>
              </p>
            </div>
          </router-link>
          <router-link
            :to="{name:'member_distribution/profitDetail',params:{type: 9}}"
            v-if="profitObj.peasWay == 1"
          >
            <div>
              <p>豌豆</p>
              <p>
                <span>{{profitObj.peasAccounted}}</span>个
                <span class="iconfont mall-gengduojiantou"></span>
              </p>
            </div>
          </router-link>
        </div>
        <div class="enterBoxList">
          <div class="fans">
            <span>我的粉丝</span>
            <span>共{{profitObj.fansNum}}人</span>
          </div>
          <div class="enterBoxListTitle">
            <span>手机号</span>
            <span>邀请时间</span>
            <span>贡献收益</span>
          </div>
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <ul>
              <li v-for="(item,index) in rankingList" :key="index">
                <div class="div1">
                  <span>{{item.mobile}}</span>
                </div>
                <div class="div">
                  <p>{{item.inviteDate[0]}}</p>
                  <p>{{item.inviteDate[1]}}</p>
                </div>
                <div class="div3">
                  <p></p>
                  <p>
                    <span>{{item.integralAccounted}}</span>积分
                  </p>
                </div>
              </li>
            </ul>
          </van-list>
        </div>
      </div> -->
      <div>
        <div class="containerTop">
          <div class="div">
            <div>
              <p>累计销售额</p>
              <p>
                <span>{{profitObj.totalSaleAmount?profitObj.totalSaleAmount:0}}</span>
              </p>
            </div>
            <div>
              <p>累计消费笔数</p>
              <p>
                <span>{{profitObj.totalSaleCount?profitObj.totalSaleCount:0}}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="sales">
          <div class="div">
            销售额：<span>{{profitObj.mallSaleAmount?profitObj.mallSaleAmount:0}}元</span>销售笔数：<span>{{profitObj.mallSaleCount?profitObj.mallSaleCount:0}}</span>
          </div>
          <div @click="toSelectMoth" class="selectMoth">
            <p v-if="queryTimeType == 1">
              <span>{{timeSt}}</span>
              <span>{{timeEn}}</span>
            </p>
            <span v-else class="monthly">{{time}}</span>
            <span class="icon iconfont mall-arrow-down"></span>
          </div>
        </div>
        <!--        <div class="mallDiv">-->
        <!--          <div class="left right">-->
        <!--            <p class="p1">-->
        <!--              <span>￥{{profitObj.mallSaleAmount?profitObj.mallSaleAmount:0}}</span>-->
        <!--            </p>-->
        <!--            <p class="p2">商城消费金额</p>-->
        <!--          </div>-->
        <!--          <div class="right">-->
        <!--            <p class="p1">-->
        <!--              <span>{{profitObj.mallSaleCount?profitObj.mallSaleCount:0}}笔</span>-->
        <!--            </p>-->
        <!--            <p class="p2">本月消费笔数</p>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="enterBoxList">
          <!--          <div class="enterBoxListTitle">-->
          <!--            <span>头像</span>-->
          <!--            <span>昵称</span>-->
          <!--            <span>销售额</span>-->
          <!--            <span>消费时间</span>-->
          <!--            <span>操作</span>-->
          <!--          </div>-->
          <van-list :finished="finished" @load="onLoad" finished-text="没有更多了" v-model="loading">
            <ul>
              <li :key="index" v-for="(item,index) in rankingList">
                <div class="div1">
                  <img :src="item.wechatHeadPic" alt class="img1" v-if="item.wechatHeadPic"/>
                  <img alt class="img1" src="static/image/microShop/head@2x.png" v-else/>
                </div>
                <div class="div divTime">
                  <p class="name">
                    <span>{{item.wechatNickName}}</span>
                  </p>
                  <div class="times">
                    <p>{{item.payTime}}</p>
                  </div>
                </div>
                <div class="div">
                  <p>
                    <span>￥{{item.saleAmount}}</span>
                  </p>
                </div>
                <!--                <div class="div">-->
                <!--                  &lt;!&ndash; <p>{{item.inviteDate[0]}}</p>-->
                <!--                  <p>{{item.inviteDate[1]}}</p>&ndash;&gt;-->
                <!--                  <p>{{item.payTime[0]}}</p>-->
                <!--                  <p>{{item.payTime[1]}}</p>-->
                <!--                </div>-->
                <div class="div">
                  <p>
                    <span @click="copyCouNo(item)" class="copyName">复制昵称</span>
                  </p>
                </div>
              </li>
            </ul>
          </van-list>
        </div>
      </div>
    </nav-content>
    <transition name="filtrate-mask">
      <div
        @click="sideFiltrateModalShow = false"
        class="filtrate-modal-mask"
        v-show="sideFiltrateModalShow"
      ></div>
    </transition>
    <transition name="filtrate">
      <div class="filtrate-modal-wrapper" ref="sideFiltrateModal" v-if="sideFiltrateModalShow">
        <div class="box">
          <p>选择时间</p>
          <div class="time">
            <span @click="showStartTime = true" class="span">{{time1}}</span>
            <span>~</span>
            <span @click="showEndTime = true" class="span">{{time2}}</span>
          </div>
        </div>
        <div class="filtrate-btn">
          <div @click="reset">取消</div>
          <div @click="sure" class="theme_bg_red">确定</div>
        </div>
      </div>
    </transition>
    <!--时间弹框-->
    <van-popup position="bottom" v-model="showcurrentTime">
      <van-datetime-picker :formatter="formatter" type="year-month" v-model="currentDate"/>
    </van-popup>
    <!--开始时间弹框-->
    <van-popup position="bottom" v-model="showStartTime">
      <van-datetime-picker
        @cancel="showStartTime = false"
        @change="setColumnValue"
        @confirm="confirmActivitesTime"
        type="datetime"
        v-model="currentDateStart"
      />
    </van-popup>
    <!--结束时间弹框-->
    <van-popup position="bottom" v-model="showEndTime">
      <van-datetime-picker
        @cancel="showEndTime = false"
        @change="setColumnValue"
        @confirm="confirmEndTime"
        type="datetime"
        v-model="currentDateEnd"
      />
    </van-popup>
  </div>
</template>

<script>
  import api from "./api";
  import util from "@/utils/util";
  import ClipboardJS from "clipboard";
  import eventBus from "@/utils/eventBus.js";

  export default {
    name: "",
    mixins: [api],
    data() {
      return {
        active: 0,
        title: "",
        type: "", //1是金额，2是积分,3是油滴，4是豌豆
        typeList: "",
        profitObj: {},
        rewardType: 0,
        rankingList: [],
        timeSt: '', //开始时间
        timeEn: '', //结束时间
        id: "",
        loading: false,
        quota: "",
        finished: false,
        copyObject: null,
        page: 0,
        time: '本月',
        currentDate: new Date(),
        time1: util.getMyMonth(new Date()),
        time2: "",
        queryTimeType: 2,
        sideFiltrateModalShow: false,
        showcurrentTime: false,
        showStartTime: false, // 开始时间弹框
        showEndTime: false, // 结束时间弹框
        currentDateStart: new Date(), // 开始时间弹框内容
        currentDateEnd: new Date() // 结束时间弹框内容
      };
    },
    created() {
      let that = this;
      eventBus.$on("timeAggregate", message => {
        console.log(message);
        if (message.queryTimeType == 1) {
          if (message.time2 == '结束时间') {
            that.time2 = '';
            that.timeSt = '选择时间'
          } else {
            that.time2 = message.time2;//按日选择
            that.timeSt = message.time1.substring(0, 11)
            that.timeEn = message.time2.substring(0, 10)
          }
        } else {
          that.time = message.time1 //按月选择
        }
        if (message.time1 == '开始时间' || message.time1 == '选择时间') {
          that.time1 = ''
        } else {
          that.time1 = message.time1;
        }
        that.queryTimeType = message.queryTimeType;
      });
    },
    mounted() {
    },
    computed: {
      bg() {
        return require("./img/up.png");
      }
    },
    methods: {
      copyCouNo(item) {
        let clipboard = new ClipboardJS('.copyName', {
          text: function () {
            return item.wechatNickName
          }
        })
        clipboard.on('success', e => {
          this.$Toast('复制成功')
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          this.$Toast('复制失败')
          clipboard.destroy()
        })
      },
      confirmActivitesTime(value) {
        // 开始时间 确认按钮
        this.showStartTime = false;
        this.time1 = util.getPayTimemin(value) + ":00";
      },
      confirmEndTime(value) {
        // 结束时间 确认按钮
        this.showEndTime = false;
        this.time2 = util.getPayTimemin(value) + ":59";
      },
      setColumnValue(index, value) {
        console.log(index);
        console.log(value);
        // 获取时间对应列中选中的值
        index = new Date();
        console.log(index);
      },
      reset() {
        this.sideFiltrateModalShow = false;
      },
      sure() {
        this.sideFiltrateModalShow = false;
        this.loadIndex1();
        // if (this.$store.state.webtype == 3) {
        //   this.loadIndex1();
        // } else {
        //   this.loadIndex();
        // }
        // this.page = 0
        // this.onLoad()
      },
      formatter(type, val) {
        if (type === "year") {
          return `${val}年`;
        } else if (type === "month") {
          return `${val}月`;
        }
        return val;
      },
      loadIndex() {
        let that = this;
        let params = {
          token: this.$store.state.login.token,
          rows: 10
        };
        that.profitData(params).then(res => {
          if (res.data.result == "success") {
            let data = res.data.data || {};
            that.profitObj = data;
            let list = res.data.data.userFans || [];
            let listData = [];
            listData = listData.concat(list) || [];
            that.rankingList = listData;
            //  that.$nextTick(() => {
            //     if(that.$refs.copybtn){
            //       that.copyBtn = new ClipboardJS(that.$refs.copybtn);
            //     }
            //   })
          }
        });
      },
      toSelectMoth() {
        this.$router.push({
          path: "/member_distribution/selectTime"
        });
      },
      loadIndex1() {
        let that = this;
        let params = {
          token: this.$store.state.login.token,
          // rows: this.profitObj.fansNum,
          timeStart: this.time1 == "开始时间" ? "" : this.time1,
          timeEnd: this.time2 == "结束时间" ? "" : this.time2
        };
        that.profitData1(params).then(res => {
          let data = res.data.data[0] || {};
          that.profitObj = data;
          // this.quota = data.sellAmount;
          let list = res.data.data[0].saleDetailList || [];
          let listData = [];
          listData = listData.concat(list) || [];
          that.rankingList = listData;
          //  that.$nextTick(() => {
          //       if(that.$refs.copybtn){
          //         that.copyBtn = new ClipboardJS(that.$refs.copybtn);
          //       }
          //     })
        });
      },
      onLoad() {
        let that = this;
        console.log(that.time1);
        that.page = that.page + 1;
        let params = {
          token: this.$store.state.login.token,
          page: that.page,
          rows: 10,
          queryTimeType: that.queryTimeType, //1 按日查询 2 按月查询
          queryTimeStart: that.time1
        };
        if (this.queryTimeType == 1) {
          params.queryTimeEnd = this.time2;
        }
        console.log(params);
        that.profitData1(params).then(res => {
          console.log(res);
          console.log(res.data.totalPages);
          if (res.data.result === "success") {
            that.profitObj = res.data.data[0];
            let data = res.data.data[0].saleDetailList || [];
            that.rankingList = that.rankingList.concat(data) || [];
            // that.rankingList.forEach(function(item) {
            //   item.payTime = item.payTime.trim().split(" ");
            //   console.log(item.payTime);
            // });
            if (that.page >= res.data.totalPages) {
              that.finished = true;
            }
          } else {
            that.finished = true;
          }
          that.loading = false;
        });
        // else {
        //   let params = {
        //     token: this.$store.state.login.token,
        //     page: that.page,
        //     rows: 10
        //   };
        //   that.profitData(params).then(res => {
        //     console.log(res.data.totalPages);
        //     if (res.data.result === "success") {
        //       that.profitObj = res.data.data;
        //       let data = res.data.data.userFans || [];
        //       that.rankingList = that.rankingList.concat(data) || [];
        //       that.rankingList.forEach(function(item) {
        //         item.inviteDate = item.inviteDate.trim().split(" ");
        //         console.log(item.inviteDate);
        //       });
        //       //  that.$nextTick(() => {
        //       //   if(that.$refs.copybtn){
        //       //     that.copyBtn = new ClipboardJS(that.$refs.copybtn);
        //       //   }
        //       // })
        //       if (that.page >= res.data.totalPages) {
        //         that.finished = true;
        //       }
        //     } else {
        //       that.finished = true;
        //     }
        //     that.loading = false;
        //   });
        // }
      },
      mallDetail() {
        //详情
        let that = this;
        that.$router.push({
          name: "micro_sho/microshopqrcode",
          params: {
            profitObj: that.profitObj
          }
        });
      },
      changeData(data) {
        let that = this;
        let params = {
          token: this.$store.state.login.token,
          rewardType: data + 1
        };
        that.monthData(params).then(res => {
          if (res.data.result === "success") {
            let data = res.data.data || [];
            that.rankingList = data;
          }
        });
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .body {
    .shareBox {
      float: right;
      display: flex;
      margin-right: 10px;
      justify-content: space-around;
      position: relative;
      z-index: 10;
      margin-top: 8px;

      div {
        width: 20px;

        img {
          width: 100%;
        }
      }
    }

    .divs {
      width: 100%;
      background-position: 50% 50%;
      background: url('./img/down.png') no-repeat center;
      overflow: hidden;
      background-size: 100% 100%;

      div {
        display: flex;
        justify-content: space-between;
        color: white;
        padding: 0 15px;
        margin: 20px 0;

        span {
          font-size: 18px;
          color: white;
        }

        .iconfont {
          margin-left: 5px;
        }
      }

      div:nth-child(1) {
        font-size: 18px;
      }

      div:nth-child(2) {
        font-size: 16px;
        color: #ece3e5;
      }

      div:nth-child(3) {
        font-size: 16px;
        color: #ece3e5;
      }
    }

    .containerTop {
      width: 100%;
      background-position: 50% 50%;
      background: url('./img/down.png') no-repeat center;
      overflow: hidden;
      background-size: 100% 100%;

      .div {
        display: flex;
        justify-content: space-around;
        height: 50px;
        color: white;
        padding: 0 15px;
        margin: 20px 0;

        div {
          text-align: center;

          p:nth-child(1) {
            font-size: 15px;
          }

          p:nth-child(2) {
            margin-top: 10px;
            font-size: 22px;
            font-weight: bolder;
          }
        }
      }
    }


    .mallDiv {
      display: flex;
      justify-content: space-between;
      margin: 10px auto;
      width: 95%;
      box-shadow: 0 1px 8px #dddddd;
      padding: 20px 10px;
      border-radius: 5px;

      .right {
        flex: 1;
        text-align: center;

        .p1 {
          font-size: 22px;
          margin-bottom: 10px;
        }

        .p2 {
          font-size: 15px;
        }
      }

      .left {
        border-right: 1px solid #dddddd;
      }
    }

    .img1 {
      width: 50px;
      border-radius: 50%;
    }
  }

  /deep/ .nav-top .navcontent .title-div {
    color: white !important;
  }

  /deep/ .theme_font_black {
    color: white !important;
  }

  /deep/ .nav-content {
    overflow: auto !important;
  }

  .sales {
    display: flex;
    justify-content: space-between;
    padding: 10px 10px;
    font-size: 14px;

    .div {
      margin auto 0
      font-size 15px

      span {
        margin-right 15px
      }
    }

    .selectMoth {
      margin auto 0
      padding: 2px 14px;
      border 1px solid #f02c2e
      border-radius: 22px;
      display: flex;

      .monthly {
        padding 10px 10px
      }

      .iconfont {
        margin auto 2px
      }

      p {
        display: flex;
        flex-direction column

        span {
          margin 2px 0
        }
      }
    }
  }

  .enterBoxList {
    padding: 20px 0 0 0;
    background: white;

    .fans {
      display: flex;
      justify-content: space-between;
      padding: 15px 14px;
      font-size: 16px;
    }

    .enterBoxListTitle {
      background: #f2f2f4;
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      text-align: center;

      span {
        flex: 1;
        font-size: 15px;
      }
    }

    ul {
      li {
        display: flex;
        justify-content: space-between;
        text-align: center;
        font-size: 16px;
        padding: 20px 0;
        border-bottom: 1px solid #f2f2f4;

        div {
          margin: auto;
          flex: 1;
        }

        .div1 {
          /* display: flex */
          /* justify-content: space-between */

          span {
            margin: auto;
          }

          p {
            margin: auto;
            margin-top: 5px;
          }
        }

        .divTime {
          flex 2
          text-align left

          .name {
            margin-bottom 10px
          }

          .times {
            color #999999
          }
        }

        .div {
          p {
            margin-bottom: 3px;
          }

          .copyName {
            padding: 5px;
            background: #f02c2e;
            border-radius: 15px;
            color: white;
            font-size: 14px;
          }
        }

        .div3 {
          font-weight: 600;

          p:nth-child(1) {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 5px;
          }

          p {
            span {
              font-size: 16px;
              font-weight: 600;
            }
          }
        }
      }
    }

    .more {
      color: #595959;
      font-size: 14px;
      text-align: center;
      height: 50px;
      line-height: 50px;
    }
  }

  .nullData {
    text-align: center;
    line-height: 80px;
    font-size: 16px;
    background: #f6f6f6;
  }

  /deep/ [class*=van-hairline]::after {
    border: 0 !important;
  }

  /deep/ .van-tab--active {
    color: #f44;
  }

  .box {
    margin: 30px 0 0 30px;

    .time {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      width: 98%;

      .span {
        border-radius: 10px;
        padding: 0px 5px;
        color: #6a6a6a;
        width: 130px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #6a6a6a;
      }

      span {
        margin: auto;
      }
    }
  }

  .filtrate-modal-mask {
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 0;
    z-index: 899;
  }

  .filtrate-modal-wrapper {
    position: absolute;
    top: 0;
    left: 15%;
    width: 85%;
    bottom: 0;
    z-index: 900;
    transition: all 0.3s;
    background: #fff;

    .filtrate-container {
      width: 100%;
      height: 100%;
      padding: 20px 15px;
    }

    .filtrate-btn {
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 44px;
      display: flex;
      justify-content: space-around;
      font-size: 16px;

      div {
        width: 50%;
        text-align: center;
        height: 44px;
        line-height: 44px;
      }

      div:nth-child(2) {
        color: white;
      }

      .btn {
        flex-shrink: 0;
        text-align: center;
        width: 40%;
        border-radius: 30px;

        &.plain {
          color: #333;
        }

        &:after {
          border-radius: 60px;
          border-color: #e5e5e5;
        }
      }
    }
  }

  .filtrate-enter-active, .filtrate-leave-active {
    transition: all 0.3s;
  }

  .filtrate-enter, .filtrate-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .filtrate-mask-enter-active, .filtrate-mask-leave-active {
    transition: all 0.3s;
  }

  .filtrate-mask-enter, .filtrate-mask-leave-to {
    opacity: 0;
  }
</style>
