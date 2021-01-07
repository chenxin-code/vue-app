<template>

  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="statistic-content">
      <div class="space"/>
      <div class="member-all-div">
        <p class="member-moudle-title">会员总览</p>
        <div class="moudle-gridle">
          <div class="moudle-item-left">
            <div class="moudle-text">昨日注册</div>
            <div class="moudle-text-num">{{memberData.preDayRegNum||0}}</div>

          </div>
          <div class="moudle-item-right">
            <div class="moudle-text">累计注册</div>
            <div class="moudle-text-num">{{memberData.totalRegNum||0}}</div>
          </div>

        </div>
        <div class="moudle-gridle-buttom">
          <div class="moudle-item-left">
            <div class="moudle-text">昨日绑卡</div>
            <div class="moudle-text-num">{{memberData.preDayBindCardNum||0}}</div>

          </div>
          <div class="moudle-item-right">
            <div class="moudle-text">累计绑卡</div>
            <div class="moudle-text-num">{{memberData.totalBindCardNum||0}}</div>
          </div>

        </div>

      </div>
      <div class="space"/>
      <div class="do-business">
        <p class="member-moudle-title">运营中心</p>
        <p class="hr-class"/>
        <div class="member-add-oil-div">
          <p class="member-all-oil-title">会员加油(元)</p>
          <div class="moudle-gridle">
            <div class="moudle-item-left">
              <div class="moudle-text">昨日加油金额</div>
              <div class="moudle-text-num">{{memberYestday.value||0}}</div>

            </div>
            <div class="moudle-item-right">
              <div class="moudle-text">当月加油金额</div>
              <div class="moudle-text-num">{{memberThisMouth.value||0}}</div>
            </div>

          </div>
        </div>
        <div class="member-add-oil-div">
          <p class="member-all-oil-title">单位卡充值(万元)</p>
          <div class="moudle-gridle-three">
            <div class="moudle-item-one">
              <div class="moudle-text">昨日充值金额</div>
              <div class="moudle-text-num">{{cardYestday.value||0}}</div>

            </div>
            <div class="moudle-item-two">
              <div class="moudle-text">当月充值金额</div>
              <div class="moudle-text-num">{{cardThisMouth.value||0}}</div>
            </div>
            <div class="moudle-item-three">
              <div class="moudle-text">上月充值金额</div>
              <div class="moudle-text-num">{{cardLastMouth.value||0}}</div>
            </div>

          </div>
        </div>
        <div class="member-add-oil-div-buttom">
          <p class="member-all-oil-title">商城交易(元)</p>
          <div class="moudle-gridle-buttom">
            <div class="moudle-item-left">
              <div class="moudle-text">昨日销售金额</div>
              <div class="moudle-text-num">{{shopYestday.value||0}}</div>

            </div>
            <div class="moudle-item-right">
              <div class="moudle-text">当月销售金额</div>
              <div class="moudle-text-num">{{shopThisMouth.value||0}}</div>
            </div>

          </div>
        </div>

      </div>
      <div class="space"/>
      <div>
        <p class="member-moudle-title-activity">APP日活</p>
        <p class="hr-class"/>
        <div class="member-add-oil-div">
          <p class="member-all-oil-title">登录人数</p>
          <div class="exchart-class" v-if="loginPersonYAxis.length">
            <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
          </div>
          <div v-else class="nonData">
            暂无数据！
          </div>

        </div>
        <div class="member-add-oil-div">
          <p class="member-all-oil-title">活跃人数</p>
          <div class="exchart-class" v-if="activityPersonYAxis.length">
            <div id="myChart1" :style="{width: '100%', height: '300px'}"></div>
          </div>
          <div v-else class="nonData">
            暂无数据！
          </div>


        </div>
      </div>

    </nav-content>
  </div>

</template>

<script>
  var echarts = require('echarts/lib/echarts');
  // 引入柱状图
  require('echarts/lib/chart/pie');
  require('echarts/lib/chart/bar');
  require('echarts/lib/chart/line');
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  require('echarts/lib/component/dataZoom');
  export default {
    name: "index",
    methods: {
      createCharts() {

      },
      getStatisticData() {
        this.$Loading.open();
        let url = "/app/json/app_data_stats/queryGroupOperationDataStats";

        let paramsData = {
          token: this.$store.state.login.token,
        };
        let _this = this;
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {

              data.data.forEach((ele) => {
                let _this = this
                if (ele.mainKey == "operation:group:refuelamount") {
                  if (ele.dateType == "1") {//标识昨天
                    this.memberYestday = ele;

                  } else if (ele.dateType == "3") {//标识上个月
                    let compartDate = this.isLastMouthOrThisMouth(ele)
                    // alert(compartDate)
                    if (compartDate) {
                      this.memberThisMouth = ele;
                    } else {

                    }

                  }

                } else if (ele.mainKey == "operation:group:cardrechargeamount") {
                  if (ele.dateType == "1") {//标识昨天
                    this.cardYestday = ele;

                  } else if (ele.dateType == "3") {//标识上个月
                    let compartDate = this.isLastMouthOrThisMouth(ele)
                    // alert(compartDate)
                    if (compartDate) {
                      this.cardThisMouth = ele;
                    } else {
                      this.cardLastMouth = ele;
                    }

                  }

                } else if (ele.mainKey == "operation:group:saleamount") {
                  if (ele.dateType == "1") {//标识昨天
                    this.shopYestday = ele;

                  } else if (ele.dateType == "3") {//标识上个月
                    // this.cardLastMouth=ele;
                    // debugger
                    let compartDate = this.isLastMouthOrThisMouth(ele)
                    // debugger
                    // alert(compartDate)
                    if (compartDate) {
                      this.shopThisMouth = ele;
                    } else {

                    }
                  }
                } else if (ele.mainKey == "access:traffic:login") {//登录人数
                  _this.loginPersonTitle = ele.value
                  let dataArr=ele.statsDate.split(" ");
                  let yearData=dataArr[0].split("-")
                  let pushData=yearData[1]+"-"+yearData[2]
                  _this.loginPersonXAxis.push(pushData)
                  _this.loginPersonYAxis.push(ele.value)


                } else if (ele.mainKey == "operation:group:activevisitor") {//活跃人数
                  _this.activityPersonTitle = ele.value
                  _this.activityPersonXAxis.push(ele.statsDate)
                  _this.activityPersonYAxis.push(ele.value)
                }

              })
              // this.itemdata = data
              if (_this.loginPersonYAxis.length!=0) {
                _this.$nextTick(() => {
                  _this.drawLine();
                })
              }

              if (_this.activityPersonYAxis.length!=0) {
                _this.$nextTick(() => {
                  _this.drawLine1();
                })
              }

            } else {

            }
          },
          error => {
            this.$Loading.close();

          }
        );
      },

      getMemberData() {
        this.$Loading.open();
        let url = "/app/json/app_data_stats/getAppStat";

        let paramsData = {
          token: this.$store.state.login.token,
        };
        let _this = this;
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            // debugger
            if (data.status == 0) {
              _this.memberData = data.data

            } else {

            }
          },
          error => {
            this.$Loading.close();

          }
        );
      },
      drawLine() {//登录人数
        // 基于准备好的dom，初始化echarts实例
        // let bar_dv=this.$refs.echart
        // let myChart = this.$echarts.init(bar_dv)
        let myChart = echarts.init(document.getElementById('myChart'))
        // console.log("=========", this.loginPersonTitle)
        // console.log("=========", this.loginPersonXAxis)
        // console.log("=========", this.loginPersonYAxis)
        // 绘制图表
        myChart.setOption({
          title: {text: '昨日:' + this.loginPersonTitle},
          tooltip: {},
          xAxis: {
            type: 'category',
            data: this.loginPersonXAxis
          },
          yAxis: {},
          series: [{
            data: this.loginPersonYAxis,
            type: 'line',
            smooth: true
          }]
        });
      },
      drawLine1() {//活跃人数
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('myChart1'))
        // 绘制图表
        myChart.setOption({
          title: {text: '昨日:' + this.activityPersonTitle},
          // tooltip: {
          //   trigger: 'axis',
          //   axisPointer: {
          //     type: 'shadow'
          //   },
          // },
          xAxis: {
            type: 'category',
            data: this.activityPersonXAxis
          },
          yAxis: {},
          series: [{
            data: this.activityPersonYAxis,
            type: 'line',
            smooth: true
          }]
        });
      },
      isLastMouthOrThisMouth(ele) {
        var oDate = new Date()
        let dataOnject = this.$util.getDealMonthFromAdd0(oDate.getFullYear(), oDate.getMonth() + 1)
        // let nowDate = this.$util.getTodayTime()
        let soruceDate = ele.statsDate;
        return this.$util.isDateBetweenCurrent(soruceDate, dataOnject.start, dataOnject.end)
      }
    },
    data() {
      return {
        memberYestday: {},//会员加油
        memberThisMouth: {},//会员加油
        cardYestday: {},//卡充值模块
        cardThisMouth: {},//卡充值模块
        cardLastMouth: {},//卡充值模块
        shopYestday: {},//商城交易模块
        shopThisMouth: {},//商城交易模块
        memberData: {},//会员数据
        loginPersonTitle: "",//登录人数统计
        loginPersonXAxis: [],//登录人数统计x轴
        loginPersonYAxis: [],//登录人数统计Y轴
        activityPersonTitle: "",//活跃人数统计
        activityPersonXAxis: [],//活跃人数统计x轴
        activityPersonYAxis: [],//活跃人数统计Y轴


      }

    },
    created() {
      this.getStatisticData()
      this.getMemberData()


    },
    mounted() {
      // this.drawLine();
      // this.drawLine1();
      // this.$nextTick(() => {
      //   this.drawLine();
      // })
      // this.$nextTick(() => {
      //   this.drawLine1();
      // })
    }
  }
</script>

<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/member-oil.styl"
  .statistic-content {
    overflow auto
    -webkit-overflow-scrolling touch

  }

  .member-add-oil-div-buttom {
    /*margin-bottom 100px*/
  }

  .moudle-gridle {
    width 100%
    display flex
    .moudle-item {
      position relative
      width 50%
      height 100px
      border 1px solid
      margin 5px
      border-radius 10px
      border-color $color-text-ll

    }
    .moudle-item-left {
      position relative
      width 50%
      height 100px
      border 1px solid
      margin-left 10px
      margin-right 5px
      border-radius 10px
      margin-bottom 5px
      box-shadow:2px 2px 10px 1px $color-text-ll
      border-color $color-text-ll

    }
    .moudle-item-right {
      margin-right 10px
      position relative
      width 50%
      margin-left 5px
      margin-bottom 5px
      height 100px
      border 1px solid
      border-radius 10px
      box-shadow:2px 2px 10px 1px $color-text-ll
      border-color $color-text-ll

    }

  }

  .moudle-gridle-buttom {
    width 100%
    display flex
    margin-bottom 20px
    .moudle-item-left {
      position relative
      width 50%
      height 100px
      border 1px solid
      margin-left 10px
      margin-right 5px
      border-radius 10px
      margin-bottom 5px
      border-color $color-text-ll
      box-shadow:2px 2px 10px 1px $color-text-ll

    }
    .moudle-item-right {
      margin-right 10px
      position relative
      width 50%
      margin-left 5px
      margin-bottom 5px
      height 100px
      border 1px solid
      border-radius 10px
      border-color $color-text-ll
      box-shadow:2px 2px 10px 1px $color-text-ll

    }

  }


  .moudle-gridle-three {
    width 100%
    display flex
    .moudle-item-one {
      width 33.3%
      height 100px
      border 1px solid
      margin-left 10px
      border-radius 10px
      box-shadow:2px 2px 10px 1px $color-text-ll
      border-color $color-text-ll

    }
    .moudle-item-two {
      width 33.3%
      height 100px
      border 1px solid
      margin-left 5px
      margin-right 5px
      border-radius 10px
      box-shadow:2px 2px 10px 1px $color-text-ll
      border-color $color-text-ll

    }
    .moudle-item-three {
      width 33.3%
      height 100px
      border 1px solid
      margin-right 10px
      border-radius 10px
      box-shadow 2px $color-shaw-ll
      border-color $color-text-ll
      box-shadow:2px 2px 10px 1px $color-text-ll

    }
  }

  .moudle-text {
    margin-top 20%
    text-align center
    color $color-text
    font-size $font-size-medium-x
  }

  .moudle-text-num {
    text-align center
    color $color-theme-r
    font-size $font-size-large-x
    margin-top 5px
    font-weight bold
  }

  .exchart-class {
    width 100%
    display flex
    justify-content center

  }
  .nonData{
    width 100%
    height 20px
    text-align center
    margin-bottom 20px
  }


</style>
