<template>
  <div class="body">
    <nav-top @backEvent="$router.go(-1)" title="累计统计"></nav-top>
    <nav-content>
      <div class="box">
        <div class="static static1">
          <div class="moth">按{{text1}}统计</div>
          <div class="time">
            <div class="showTime" @click="selectTime">
              <span>{{Time}}</span>
              <i class="icon iconfont mall-arrow-down"></i>
            </div>
            <div class="selectTime" @click="exchange">
              <span class="selected">{{text1}}</span>
              <van-icon name="exchange"/>
              <span>{{text2}}</span>
            </div>
          </div>
        </div>
        <div class="static static2">
          <p>本年预估收益<span>￥{{obj.datePredictRebate}}</span></p>
          <p>本年到账收益<span>￥{{obj.dateRealityRebate}}</span></p>
        </div>
      </div>
      <div class="list">
        <div class="classification title">
          <p>日期</p>
          <p>预估收益</p>
          <p>实际收益</p>
        </div>
        <div class="classification profitDetail" @click="detail(item)" v-for="item in list">
          <p>{{item.rebateDateStr}}</p>
          <p class="p_profit">￥{{item.predictRebate}}</p>
          <p class="p_profit">￥{{item.realityRebate}}</p>
          <i class="icon iconfont mall-gengduojiantou"></i>
        </div>
      </div>
      <van-popup position="bottom" v-model="showcurrentTime">
        <div class="year">
          <van-datetime-picker v-model="currentDate" @confirm="confirmACurrentTime" format="yyyy"
                               @cancel="showcurrentTime = false" type="year-month" :formatter="formatter"/>
        </div>
      </van-popup>
      <van-popup position="bottom" v-model="showStartTime">
        <van-datetime-picker
          v-model="currentDateStart"
          type="year-month"
          :formatter="formatter"
          @confirm="confirmActivitesTime"
          @cancel="showStartTime = false"
        />
      </van-popup>
      <div v-show="shareRebate">
        <p class="nullData" v-show="list.length==0">暂无查询结果</p>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import util from "@/utils/util";

  export default {
    name: "static",
    data() {
      return {
        text1: '月',
        text2: '日',
        Time: '选择时间',
        shareRebate: false,
        currentDate: new Date(),
        showcurrentTime: false,
        showStartTime: false,
        currentDateStart: new Date(),
        list: [],
        obj: {}
      }
    },
    mounted() {
      let date = new Date()
      this.Time = date.getFullYear()
      this.MonthData() //进来默认按月份查(传年份),查全部
    },
    methods: {
      MonthData() {
        let paramsData = {
          token: this.$store.state.login.token,
          year: this.Time == '选择时间' ? '' : this.Time //按月,传年份
        };
        this.$Loading.open()
        this.$http.post("/app/json/app_distribution_user/shareRebateMonth", paramsData).then(res => {
          this.$Loading.close()
          this.shareRebate = true
          console.log(res);
          let data = res.data;
          if (data.status == 0) {
            this.list = data.data.dateRebateDetailList || [];
            this.obj = data.data
          } else {
            this.$Toast(res.data.info);
          }
        });
      },
      dayData() {
        let paramsData = {
          token: this.$store.state.login.token,
          yearMonth: this.Time == '选择时间' ? '' : this.Time //按日，传月份
        };
        this.$Loading.open()
        this.$http.post("/app/json/app_distribution_user/shareRebateDay", paramsData).then(res => {
          this.$Loading.close()
          this.shareRebate = true
          console.log(res);
          let data = res.data;
          if (data.status == 0) {
            this.list = data.data.dateRebateDetailList || [];
            this.obj = data.data
          } else {
            this.$Toast(res.data.info);
          }
        });
      },
      exchange() {
        if (this.text1 == '月') {
          this.text2 = '月'
          this.text1 = '日'
        } else {
          this.text1 = '月'
          this.text2 = '日'
        }
      },
      selectTime() {
        if (this.text1 == '月') {
          this.showcurrentTime = true //按月
        } else {
          this.showStartTime = true
        }
      },
      confirmACurrentTime(value) { //按月
        console.log(value);
        this.Time = util.getMyYear(value);
        console.log(this.Time);
        this.showcurrentTime = false
        this.MonthData()
      },
      formatter(type, val) {
        if (type === "year") {
          return `${val}年`;
        } else if (type === "month") {
          return `${val}月`;
        }
        return val;
      },
      confirmActivitesTime(value) { //时间 确认按钮,按日
        this.showStartTime = false;
        this.Time = util.getMyMonth(value);
        this.dayData()
      },
      detail(data) {
        this.$router.push({
          path: '/promotion_income/detail',
          query: {
            data: data
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .body {
    background #f6f6f6 !important

    .box {
      background white
      margin-bottom 10px
      padding 15px 15px
      font-size 15px

      .static {
        display flex
        justify-content space-between
        /*font-size 14px*/

        .moth {
          margin auto 0
        }

        .time {
          margin auto 0
          display flex

          .showTime {
            padding: 8px 6px;
            border-radius: 13px;
            margin auto 5px
            background #f6f6f6
          }

          .selectTime {
            margin auto 0

            span {
              padding 0 5px
            }

            .selected {
              color #acacac
            }

            /deep/ .van-icon {
              color #acacac
            }
          }
        }
      }

      .static1 {

      }

      .static2 {
        margin-top 10px

        span {
          color #d02c37
          margin-left 4px
          font-weight 600
        }
      }
    }

    .list {
      background white
      overflow hidden

      .title {
        background #f6f6f6
        border-radius 5px
      }

      .classification {
        width 92%
        margin 15px auto
        padding 15px 0
        display flex
        font-size 16px
        text-align center

        p {
          flex 1
        }
      }

      .profitDetail {


        .p_profit {
          color #d02a37
        }
      }
    }
    .year {
      /deep/ .van-picker-column:nth-child(2) {
        display none
      }
    }
  }

  /deep/ .theme_bg_white {
    background-color: #d02c37 !important
  }

  /deep/ .theme_font_black {
    color white !important
  }
  .nullData {
    font-size 20px;
    margin-top 100px;
    text-align center;
  }
</style>
