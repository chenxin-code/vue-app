/**Created by liaoyingchao on 2019-05-31.*/

<template>
  <div class="index">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="bills-body">
        <div ref="scrollDiv_1" class="bills-content" v-show="tabbarIndex == 1">
          <div class="statistics">
              <div class="time-btn" @click="showDateSelect = true">
              <span>{{showDate}}</span>
              <div class="down-arrow" :class="{active: showDateSelect}"></div>
            </div>
            <div class="chart-div">
              <div class="title-row line_bottom">
                <div class="text">
                  <span>总支出</span>
                  <span class="small">（共消费{{listData ? listData.length : 0}}笔）</span>
                </div>
                <div class="price">¥{{$util.toDecimal2(totalAmount)}}</div>
              </div>
              <!--<div class="chart-tabs">-->
                <!--<div class="tab-item" :class="{'theme_standard_bdr_i theme_standard_font': tabIndex == 1}"-->
                     <!--@click="tabEvent(1)">分类-->
                <!--</div>-->
                <!--<div class="tab-item" :class="{'theme_standard_bdr_i theme_standard_font': tabIndex == 2}"-->
                     <!--@click="tabEvent(2)">月份-->
                <!--</div>-->
              <!--</div>-->
              <div id="chartId_1" class="chart-block" v-show="tabIndex == 1 && listData != ''">
              </div>
              <div class="chart-block" v-show="tabIndex == 1 && listData == ''">
                <div class="no-data">
                  <img src="./imgs/nodata.png">
                  <div class="theme_font_gray">暂无数据</div>
                </div>
              </div>
              <div id="chartId_2" class="chart-block" v-show="tabIndex == 2"></div>
            </div>
          </div>
          <div class="month-title">{{monthTitle}}</div>
          <div class="list-div">
            <div class="tip-div theme_font_gray" v-show="listData == ''">选择月份没有账单</div>
            <div class="item" v-for="item in listData" v-show="listData != ''" @click="showBillDetail(item)">
              <BillItem :itemData="item"></BillItem>
            </div>
          </div>
        </div>
        <div ref="scrollDiv_2" class="bills-content" v-show="tabbarIndex == 2">
          <div class="statistics">
            <div class="time-btn" @click="showTypeSelect = true">
              <span>{{zdType.name}}</span>
              <div class="down-arrow" :class="{active: showTypeSelect}"></div>
            </div>
          </div>
          <div v-for="item in showListData">
            <div class="month-title">
              <div>{{item.name}}</div>
              <div class="price">消费金额：¥{{$util.toDecimal2(item.total)}}</div>
            </div>
            <div class="list-div">
              <div class="item" v-for="sitem in item.arr" @click="showBillDetail(sitem)">
                <BillItem :itemData="sitem"></BillItem>
              </div>
            </div>
          </div>
        </div>
        <div class="tabbar line_top">
          <div class="item" @click="tabbarEvent(1)">
            <img src="./imgs/icon1-1.png" v-if="tabbarIndex == 1">
            <img src="./imgs/icon1-2.png" v-else>
          </div>
          <div class="item" @click="tabbarEvent(2)">
            <img src="./imgs/icon2-1.png" v-if="tabbarIndex == 2">
            <img src="./imgs/icon2-2.png" v-else>
          </div>
        </div>
      </div>
    </nav-content>
    <van-popup v-model="showDateSelect" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        :formatter="formatter"
        @confirm="dateSelected"
        @cancel="showDateSelect = false"
      />
    </van-popup>
    <van-popup v-model="showTypeSelect" position="bottom">
      <div class="types-div">
        <div class="type-item" :class="{line_top: idx != 0}" v-for="(item, idx) in allTypes"
             @click="typeSelectEvent(item)">{{item.name}}
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  // 引入 ECharts 主模块
  var echarts = require('echarts/lib/echarts');
  // 引入柱状图
  require('echarts/lib/chart/pie');
  require('echarts/lib/chart/bar');
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  require('echarts/lib/component/dataZoom');

  import BillItem from './base/bill-item'

  export default {
    name: "index",
    components: {
      BillItem
    },
    data() {
      return {
        tabbarIndex: 1,
        tabIndex: 1,
        showDate: '',
        showDateSelect: false,
        showTypeSelect: false,
        currentDate: new Date(),
        monthTitle: '',
        listData: null,
        yearDatas: null,
        allListData: [],
        totalAmount: 0,
        zdType: {
          name: '所有订单',
          type: ''
        },
        allTypes: [
          {
            name: '所有订单',
            type: ''
          },
          {
            name: 'App加油',
            type: '1'
          },
          {
            name: '线下加油',
            type: '2'
          },
          {
            name: '商城购物',
            type: '3'
          },
          {
            name: '线下购物',
            type: '4'
          },
          // {
          //   name: '加油卡充值',
          //   type: '5'
          // }
        ],
        showListData: [],
        listSite_1: 0,
        listSite_2: 0
      }
    },
    methods: {
      typeSelectEvent: function (item) {
        this.zdType = item
        this.showTypeSelect = false
        this.getBillsList()
      },
      showBillDetail: function (item) {
        this.$router.push({
          path: '/usercenter/billdetail',
          query: {
            tradeNo: item.tradeNo
          }
        })
      },
      tabEvent: function (idx) {
        this.tabIndex = idx
        if (idx == 1) {
          if (this.listData != null) {
            return
          }
          this.getMyBills()
        } else {
          if (this.yearDatas != null) {
            return
          }
          this.yearBills()
        }
      },
      dateSelected: function () {
        this.getShowDate(this.currentDate);
        this.showDateSelect = false
        this.getMyBills()
      },
      formatter(type, value) {
        if (type === 'year') {
          return `${value}年`;
        } else if (type === 'month') {
          return `${value}月`
        }
        return value;
      },
      tabbarEvent: function (index) {
        this.tabbarIndex = index;
      },
      yearBills: function () {
        let url = '/app/json/app_stock_month_bills/queryMulMonthBillsList';
        let oDate = new Date(), oYear = oDate.getFullYear(), oMonth = oDate.getMonth() + 1
        let startMonth = '';
        if (oMonth == 12) {
          startMonth = oYear + '01'
        } else {
          startMonth = (oYear - 1) + this.$util.getzf(oMonth + 1);
        }
        let endMonth = oYear + this.$util.getzf(oMonth);
        let paramsData = {
          StockMonthBillsModel: {
            userId: this.$store.state.userInfo.userId,
            startMonth: startMonth,
            endMonth: endMonth
          }
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.yearDatas = data.data
              // this.createBarChart()
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      getMyBills: function () {
        let url = '/app/json/app_stock_month_bills/queryTradeBillsList';
        var reg = /[\u4e00-\u9fa5]/g;
        let month = this.showDate.replace(reg, "");
        let paramsData = {
          stockTradeBillsModel: {
            userId: this.$store.state.userInfo.userId,
            month: month
          }
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.listData = data.data
              this.createPieChart()
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      getBillsList: function () {
        let url = '/app/json/app_stock_month_bills/queryTradeBillsList';
        let paramsData = {
          stockTradeBillsModel: {
            userId: this.$store.state.userInfo.userId,
            bizType: this.zdType.type
          }
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.allListData = data.data
              this.createShowListData()
              // this.createPieChart()
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      getShowDate: function () {
        let oDate = new Date(this.currentDate),
          oYear = oDate.getFullYear(),
          oMonth = oDate.getMonth() + 1
        this.showDate = oYear + '年' + this.$util.getzf(oMonth) + '月'
        this.monthTitle = oMonth + '月份账单'
      },
      createPieChart: function () {
        this.totalAmount = 0
        let dic = {}
        let listShowArr = []
        for (let i = 0; i < this.listData.length; i++) {
          let item = this.listData[i]
          let bizType = item.bizType
          if (bizType == '5') {
            continue;
          }
          listShowArr.push(item)
          let amount = item.amount
          let name = item.bizTypeName
          let sDic = dic[bizType] ? dic[bizType] : {
            value: 0
          }
          sDic.name = name
          sDic.value += parseInt(amount)
          dic[bizType] = sDic

          this.totalAmount += amount
        }
        this.listData = listShowArr;
        let arr = []
        for (let key in dic) {
          arr.push(dic[key])
        }

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chartId_1'));
        // 绘制图表
        myChart.setOption({
          label: {
            show: true,
            rich: {
              a: {
                color: '#333',
                fontSize: 9
              },
              b: {
                color: '#333',
                fontSize: 12,
                fontWeight: 600
              }
            },
            formatter: function (val) {   //让series 中的文字进行换行
              // console.log(val)
              return '{a|' + val.name + '}\n' + '{b|¥' + val.value + '}';
            }
          },
          title: {
            text: ''
          },
          tooltip: {},
          // color: ['#6061CA','#E36B88','#74E0C3','#F6CEBD'],
          series: [{
            name: '销量',
            type: 'pie',
            radius: ['50%', '70%'],
            data: arr
          }]
        });
      },
      createBarChart: function () {
        let oDate = new Date()
        let oYear = oDate.getFullYear()
        let oMonth = oDate.getMonth() + 1

        let xArr = []
        let yArr = []
        let yy = oYear - 1
        let xm = oMonth
        for (let i = 0; i < 12; i++) {
          xm++
          if (xm == 13) {
            xm = 1
            yy += 1
          }
          let key = yy + this.$util.getzf(xm);
          for (let i = 0; i < this.yearDatas.length; i++) {
            let item = this.yearDatas[i]
            if (item.month == key) {
              yArr.push(item.amount)
            }
          }
          if (yArr.length < i + 1) {
            yArr.push(0)
          }
          let xStr = xm + '月'
          xArr.push(xStr)
        }
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chartId_2'));
        // 绘制图表
        myChart.setOption({
          label: {
            show: true,
            position: 'top',
            rich: {
              // a: {
              //   color: '#333',
              //   fontSize: 9
              // },
              b: {
                color: '#333',
                fontSize: 12,
              }
            },
            formatter: function (val) {   //让series 中的文字进行换行
              // console.log(val)
              return '{b|¥' + val.value + '}';
            }
          },
          grid: {
            left: '12%',   //距离左边的距离
            right: '5%', //距离右边的距离
            bottom: '15%',//距离下边的距离
            top: '10%' //距离上边的距离
          },
          xAxis: {
            type: 'category',
            data: xArr,
            //max: 4
          },
          yAxis: {
            show: false,
            type: 'value',
            splitLine: {
              show: false
            },
            axisTick: {       //y轴刻度线
              show: false
            },
            axisLine: {       //y轴
              show: false

            },
          },
          dataZoom: [
            {
              show: false,
              realtime: true,
              start: 65,
              end: 100
            },
            {
              type: 'inside',
              realtime: true,
              start: 65,
              end: 85
            }
          ],
          series: [{
            data: yArr,
            type: 'bar',
            barWidth: '40%',
            itemStyle: {
              normal: {
                color: '#4ad2ff'
              }
            },
          }]
        });
      },
      createShowListData: function () {
        let lastmonth = ''
        let lastarr = []
        let total = 0
        let array = []
        for (let i = 0; i < this.allListData.length; i++) {
          let item = this.allListData[i]
          if (item.bizType == '5') {
            continue;
          }
          let time = item.tradeTime
          time = time.replace(/-/g, '/');
          let month = (new Date(time)).getMonth() + 1
          if (lastmonth != month) {
            if (lastmonth != '') {
              array.push({
                name: lastmonth + '月份账单',
                total: total,
                arr: lastarr
              })
            }
            lastarr = []
            total = 0
          }
          lastmonth = month
          let amount = item.amount
          total += amount
          lastarr.push(item)
          // if (this.allListData[i].bizTypeName == '商城购物' || this.allListData[i].bizTypeName == '线下购物'){
          //
          // }
        }
        if (lastmonth != '') {
          array.push({
            name: lastmonth + '月份账单',
            total: total,
            arr: lastarr
          })
        }
        this.showListData = array
        // let arr = [];
      }
    },
    created() {
      this.getShowDate();
    },
    mounted() {
      this.tabEvent(1)
      this.getBillsList();
    },
    beforeRouteLeave: function (to, from, next) {
      if (to.path == '/usercenter/billdetail') {
        this.listSite_1 = this.$refs.scrollDiv_1.scrollTop
        this.listSite_2 = this.$refs.scrollDiv_2.scrollTop
      }
      next()
    },
    activated() {
      if (this.$refs.scrollDiv_1) {
        this.$refs.scrollDiv_1.scrollTop = this.listSite_1
      }
      if (this.$refs.scrollDiv_2) {
        this.$refs.scrollDiv_2.scrollTop = this.listSite_2
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .index {
    width 100%
    height 100%
    overflow hidden

    .types-div {
      background-color white;
      padding 0 12px;

      .type-item {
        padding 15px 3px;
        font-size 13px;
      }
    }

    .bills-body {
      width 100%
      height 100%
      overflow hidden
      position relative;
      background-color #efefef;

      .bills-content {
        position absolute;
        left 0;
        right 0;
        bottom 50px;
        top 0px;
        overflow-y auto;
        -webkit-overflow-scrolling touch;

        .time-btn {
          padding 12px 5px 12px 18px;
          font-size 12px;
          display flex;
          align-items center;
        }

        .chart-div {
          background-color white;
          padding 0 10px;
          position relative;
          margin-bottom 200px;

          .title-row {
            padding 12px 10px;
            display flex;
            align-items center;

            .text {
              flex 1;
              font-size 16px;

              .small {
                font-size 12px;
              }
            }

            .price {
              font-size 16px;
              font-weight 500;
            }
          }

          .chart-tabs {
            padding 0 100px;
            width 100%;
            display flex;
            align-items center;
            justify-content space-evenly;

            .tab-item {
              font-size 14px;
              line-height 18px;
              margin 10px 0 3px;
              border-bottom 2px solid transparent;
            }
          }

          .chart-block {
            height 200px;
            position absolute;
            left 0;
            right 0;
            //top 73px;
            background-color white;

            .no-data {
              position absolute;
              left 0;
              right 0;
              top 0;
              text-align center;

              img {
                height 140px;
                margin-bottom 10px;
              }
            }
          }
        }

        .month-title {
          padding 12px 18px;
          font-size 12px;
          display flex;
          align-items center;
          justify-content space-between;
        }

        .list-div {
          overflow hidden;

          .tip-div {
            padding 30px 20px;
            font-size 12px;
            text-align center;
          }

          .item {
            padding-bottom 10px;
          }
        }
      }

      // 下箭头

      .down-arrow {
        position: relative;
        width: 20px;
        height: 8px;
        margin-right: 10px;
      }

      .down-arrow::after {
        display: inline-block;
        content: " ";
        height: 9px;
        width: 9px;
        border-width: 0 1px 1px 0;
        border-color: #999999;
        border-style: solid;
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        transform-origin: center;
        transition: transform .3s;
        position: absolute;
        //top: 50%;
        right: 5px;
        margin-top: -2px;
      }

      // 加上active旋转成 上箭头

      .down-arrow.active::after {
        transform-origin: center;
        transform: rotate(-135deg);
        transition: transform .3s;
        margin-top: 2px;
      }

      .tabbar {
        position absolute;
        left 0;
        right 0;
        bottom 0;
        background-color white;
        display flex;
        align-items center;

        .item {
          flex 1;
          font-size 0;
          text-align center;

          img {
            width 50px;
            height 50px;
          }
        }
      }
    }
  }
</style>
