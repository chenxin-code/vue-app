<template>
  <div>
    <nav-top title="预付款分配明细" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="time-change" @click="showTime = true">
        <div  class="filter-btn">
          <div class="time">{{ currentYear }}年{{ currentMonth }}月</div>
        </div>
        <i class="icon"></i>
      </div>
      <div class="pay-list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad" class="search-list" style='margin-top: 30px'>
          <div class="detail-list" v-for='(item,index) in list' :key="index">
            <h3>分配时间：{{item.acctAmountTime}}</h3>
            <div class="detail">
              <div  class="info">
                <p class='top'>
                  {{item.afterAcctAmount}}
                </p>
                <p class='bottom'>
                  分配金额
                </p>
              </div>
              <div  class="info">
                <p class='top'>
                  {{item.acctAmount}}
                </p>
                <p class='bottom'>
                  余额
                </p>
              </div>
            </div>
          </div>
        </van-list>
      </div>
      <!-- 日期 -->
      <van-popup position="bottom" v-model="showTime">
        <van-datetime-picker
          v-model="currentDate"
          type="year-month"
          :formatter="formatter"
          @confirm="confirmDate"
          @cancel="showTime = false"
        />
    </van-popup>
    </nav-content>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    data() {
      return {
        showTime: false, // 显示时间
        loading: false,
        finished: false,
        rows: 10,
        page: 0,
        userInfoData: {},
        startTime: this.getMonth(new Date(), 1),
        endTime: this.getMonth(new Date(), 2),
        currentDate: new Date(), // 当前时间
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth() + 1,
        endTradeTime: this.getMonth(new Date(),1)+"TO"+this.getMonth(new Date(),2),
        list: []
      }
    },
    methods: {
      formatter(type, val) {
        if (type === 'year') {
          return `${val}年`;
        } else if (type === 'month') {
          return `${val}月`
        }
        return val
      },
      personAmount(userId) {
        let amount = 0
        if (typeof userId == 'string') {
          amount = userId.split(',').length
        }
        return amount
      },
      getMonth(date, val) {
        if (val == 1) {
          return moment(date).subtract(1,'months').format("YYYY-MM-DD 00:00:00")
        } else {
          return (moment(date).format("YYYY-MM-DD 23:59:59"))
        }
      },
      confirmDate(date) {
        let startTime = this.getMonth(date, 1)
        let endTime = this.getMonth(date, 2)
        this.endTradeTime = startTime+"TO"+endTime
        // 确认选择日期
        this.currentYear = new Date(date).getFullYear()
        this.currentMonth = new Date(date).getMonth() + 1
        this.showTime = false
        this.page = 0;
        this.list = []
        this.onLoad()
      },
      onLoad() {
        console.log(this.currentYear, this.currentMonth)
        this.page++
        let obj = {
          page: this.page,
          rows: this.rows,
          acctAmountTimeStr: this.endTradeTime
          // companyUserId: this.$route.query.etpUserId,
          // startTime: this.startTime,
          // endTime: this.endTime
        }
        this.$http.post("/app/json/company_user_app/getCompanyUserAmount",obj).then(res=>{
          this.loading = false
          let data = res.data;
          if (data.status == 0) {
            if (data.data instanceof Array) {
              this.list.push(...data.data)
              if (this.list.length >= data.totalRecords) {
                this.finished = true
              }
            } else {
              this.finished = true
            }
          } else {
            this.$toast(res.info)
            this.finished = true
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
/deep/ .nav-content{
  padding: 10px;
}
.pay-list{
  overflow-y: auto;
  margin-top: 20px;
  height: calc(100% - 100px);
}
.time-change {
  display flex
  position: sticky;

  top: 20px;
  justify-content space-between
  box-shadow : 0px 0px 3px rgba(0,0,0,0.2)
  align-items center
  padding: 11px 15px
  background: #fff;
  border-radius: 4px;
  margin-bottom: 10px;
  flex-shrink 0
  .filter-btn {
    border-radius 20px
    padding: 6px 15px
    background: $color-background-lll
    font-size: 16px
    display flex
    justify-content space-between
    align-items center

    .time {
      color: $color-text
    }
  }
  .icon {
    display: inline-block;
    width: 28px;
    height: 28px;
    background: url(./images/date.png) no-repeat;
    background-size: 100% auto;
  }
  .num {
    font-size 14px

    .info {
      color $color-theme-r
      font-weight bold
    }
  }
}
.detail-list{
  padding: 10px 20px;
  border-radius: 4px;
  margin: 10px 1px;
  box-shadow: 0px 0px 3px rgba(0,0,0,0.2);

  background: #fff;
  h3{
    font-size: 14px;
    font-weight 400;
  }
  .detail{
    display: flex;
    
    justify-content: space-around;
    padding-top: 10px;
    .info{
      text-align center
      
      .top{
        font-weight 600;
        line-height 20px
        font-size 14px
      }
      .bottom{
        color:#909090;
      }
    }
  }
  .cou-type{
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title{
      display: inline-block;
      padding: 3px 8px;
      background:#FF7043;
      border-radius: 15px;
      margin-right: 5px;
      line-height: 18px;
      color: #fff;
    }
    .name{
      font-size: 15px;
      font-weight: 600;
      color: #101010;
    }
    .icon2{
      font-size 12px;
    }
  }
  .t-detail{
    /deep/ .van-icon-arrow {
      vertical-align: middle;
    }
    span{
      vertical-align: middle;
    }
  }
}
</style>