<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <van-tabs v-model="activeTab" color="#C9A063" title-active-color="#C9A063" @click="changeTabs">
        <van-tab title="推荐注册"></van-tab>
        <van-tab title="推荐消费"></van-tab>
      </van-tabs>
      <div class="summary-info">
        <div class="date-time" @click="isShowDatePicker = true">
          <span class="date-text">{{ queryTime }}</span>
          <van-icon name="arrow-down" class="icon-arrow"/>
        </div>
        <div class="total-info" v-if="activeTab == 0">
          共计推荐注册人数<span class="num">{{ totalInfo.totalNum || 0 }}</span>人
        </div>
        <div class="total-info" v-else>
          总计金额¥<span class="num">{{ totalInfo.totalOrderAmount || 0 }}</span>
        </div>
      </div>
      <div class="table-container" v-if="activeTab == 0">
        <div class="thead-c">
          <p class="index">序号</p>
          <p class="name">日期</p>
          <p class="name">账号</p>
        </div>
        <div class="tbody-c">
          <div class="tr-c" v-for="(item, index) in registerData" :key="index">
            <div class="td-c">{{ index + 1 }}</div>
            <div class="td-c">{{ item.referrerTime }}</div>
            <div class="td-c">{{ item.phone }}</div>
          </div>
        </div>
      </div>
      <div class="table-container" v-else>
        <div class="thead-c">
          <p class="index">序号</p>
          <p class="name">日期</p>
          <p class="name">商品</p>
          <p class="name">金额</p>
        </div>
        <div class="tbody-c">
          <div class="tr-c" v-for="(item, index) in consumptionData" :key="index">
            <div class="td-c">{{ index + 1 }}</div>
            <div class="td-c">{{ item.referrerTime }}</div>
            <div class="td-c">{{ dealwithProdName(item.orderProInfos)}}</div>
            <div class="td-c">￥{{ item.orderAmount }}</div>
          </div>
        </div>
      </div>
    </nav-content>
    <van-popup v-model="isShowDatePicker" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        title="选择年月"
        @confirm="confirmChoseDate"
        @cancel="isShowDatePicker = false"
        :max-date="maxDate"
      />
    </van-popup>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data() {
    return {
      activeTab: 0,
      tempActiveTab: 0,
      queryTime: '',
      currentDate: '',
      isShowDatePicker: false,
      maxDate: new Date(),
      registerData: [],
      consumptionData: [],
      totalInfo: {
        totalNum: '',
      }
    }
  },
  created() {
    this.queryTime = moment().format('YYYY-MM')
    this.initReferUserNum()
    this.initRegisterAwardList()
  },
  methods: {
    changeTabs(name) {
      if (name !== this.tempActiveTab) {
        this.initReferUserNum()
        this.initRegisterAwardList()
      }
      this.tempActiveTab = name
    },
    // 注册
    initRegisterAwardList() {
      this.$Loading.open();
      let params = {
        referrerTime: this.queryTime
      }
      if (this.activeTab == 0) {
        params.refererType = 1
      } else {
        params.refererType = 3
      }
      this.$http.post('/app/json/user/getMyReferUserList', params).then(res => {
        this.$Loading.close();
        let data = res.data
        if (data.status == 0) {
          if (data.data.regUserInfoList instanceof Array && data.data.regUserInfoList.length > 0 ) {
            data.data.regUserInfoList.forEach(item => {
              item.referrerTime = moment(item.referrerTime).format('YYYY-MM-DD')
              let tempPhone = item.phone + ''
              item.phone = tempPhone.substr(0,3) + "****" + tempPhone.substr(7)
            })
          }
          if (this.activeTab == 0) {
            this.registerData = data.data.regUserInfoList || []
          } else {
            this.consumptionData = data.data.regUserInfoList || []
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close();
        this.$Toast(`queryRecommendRegisterAwardList err ${err}`)
      })
    },
    confirmChoseDate(value) {
      this.queryTime = moment(value).format('YYYY-MM')
      this.isShowDatePicker = false
      this.initReferUserNum()
      this.initRegisterAwardList()
    },
    // 汇总信息
    initReferUserNum() {
      this.$Loading.open();
      let params = {
        referrerTime: this.queryTime
      }
      if (this.activeTab == 0) {
        params.refererType = 1
      } else {
        params.refererType = 3
      }
      this.$http.post('/app/json/user/getMyReferUserNum', params).then(res => {
        this.$Loading.close();
        let data = res.data
        if (data.status == 0) {
          this.totalInfo = data.data;
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close();
        this.$Toast(`getMyReferUserNum err ${err}`)
      })
    },
    // 处理名称
    dealwithProdName(prodInfo) {
      let result = '-'
      if (prodInfo) {
        let tempArr = []
        JSON.parse(prodInfo).forEach(item => {
          tempArr.push(item.skuName)
        })
        result = tempArr.join(',')
      }
      return result
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/deploy/chum/assets/stylus/chum-public.styl'
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.summary-info {
  padding 0 15px;
  background-color #c8a063;
  display flex;
  justify-content space-between;
  align-items center;
  color #fff;
  height 55px;
  margin-top 10px;
  font-size 14px;
  .date-time {
    flex 2;
    display flex;
    align-items center;
    .date-text,
    .icon-arrow {
      font-weight 500;
    }
    .icon-arrow {
      margin-left 5px;
    }
  }
  .total-info {
    text-align right;
    line-height 18px;
    flex 3;
    font-weight 500;
    .num {
      font-weight 700;
      // color $color-theme-r
    }
  }
}
.table-container {
  margin 10px 20px;
  border-radius 5px;
  box-shadow 0 0 5px #ddd;
  text-align center;
  .thead-c {
    display flex;
    background-color #efefef
    padding 10px 0;
    .index,
    .name {
      font-size 13px;
      color #333;
    }
    .index {
      flex 1
    }
    .name {
      flex 2
    }
  }
  .tbody-c {
    .tr-c {
      display flex;
      .td-c {
        ellipse()
        padding 10px 0;
        flex 2
        &:first-child {
          flex 1
        }
      }
    }
  }
}
</style>