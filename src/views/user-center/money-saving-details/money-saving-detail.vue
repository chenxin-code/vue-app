<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <!-- 顶部标题背景 -->
      <div class="top-tip">
        <img
          src="../../../components/mall2/ranking/images/Leaderboard-bg.png"
          alt
          class="leaderboard-bg"
        />
        <div class="change-time-btn" @click="showPicker = true">
          <span>{{ queryYear }}年</span>
          <i class="iconfont mall-arrow-down" style="font-size: 13px;"></i>
        </div>
        <p class="top-price">￥{{ $util.toDecimal2(yearSaveMoney) }}</p>
      </div>
      <!-- tab切换 -->
      <div class="tab-container">
        <div
          v-for="(item, index) in tabData"
          :key="index"
          class="tab-btn card"
          :class="{ active: index == tabIndex }"
          @click="changeTabHandler(item, index)"
        >
          <p class="tab-text-c">
            <span class="name">{{ item.tabText }}</span>
            <span class="price">￥{{ item.money }}</span>
          </p>
        </div>
      </div>
      <!-- 列表数据 -->
      <div class="scroll-container">
        <scroll
          ref="scroll"
          class="data-list"
          :hasMore="hasMore"
          :pullUpLoad="true"
          @pullingUp="queryDiscountDetail"
          :data="dataList"
          v-if="dataList.length > 0">
          <div class="scroll-c">
            <div class="item" v-for="(item, index) in dataList" :key="index">
              <div v-if="item.type == 1 && item.discountType == 102">
                <p class="title">{{ item.discountTypeName }}</p>
                <p class="text">消费网点：{{ item.storeName }}</p>
                <p class="text">消费油品：{{ item.payBody }}</p>
                <p class="text">加油时间：{{ item.payTime }}</p>
                <p class="text">支付方式：{{ item.payModeName }}</p>
                <p class="text">优惠金额：{{ item.discountAmount }}</p>
              </div>
              <div v-else-if="item.type == 1 && item.discountType == 100">
                <p class="title">{{ item.discountTypeName }}</p>
                <p class="text">消费网点：{{ item.storeName }}</p>
                <p class="text">消费油品：{{ item.payBody }}</p>
                <p class="text">加油时间：{{ item.payTime }}</p>
                <p class="text">优惠金额：{{ item.discountAmount }}</p>
              </div>
              <div v-else-if="item.type == 2 && item.discountType == 100">
                <p class="title">{{ item.discountTypeName }}</p>
                <p class="text">活动名称：{{ item.activityName }}</p>
                <p class="text">订单号：{{ item.orderId }}</p>
                <p class="text">下单时间：{{ item.payTime }}</p>
                <p class="text">优惠金额：{{ item.discountAmount }}</p>
              </div>
              <div v-else>
                <p class="title">{{ item.discountTypeName }}</p>
                <p class="text">折扣方式：{{ item.payModeName }}</p>
                <p class="text">订单号：{{ item.orderId }}</p>
                <p class="text">下单时间：{{ item.payTime }}</p>
                <p class="text">优惠金额：{{ item.discountAmount }}</p>
              </div>
            </div>
          </div>
        </scroll>
        <p class="no-result" v-else>暂无数据~</p>
      </div>
    </nav-content>
    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        :columns="columns"
        show-toolbar
        @cancel="onCancel"
        @confirm="onConfirm"/>
    </van-popup>
  </div>
</template>
<script>
import Scroll from "@/components/base/scroll/scroll";
import moment from 'moment'
export default {
  components: {
    Scroll
  },
  data() {
    return {
      yearSaveMoney: 0,
      tabIndex: 0,
      hasMore: true,
      columns: [],
      showPicker: false,
      queryYear: moment().format('YYYY'),
      tabData: [
        {
          key: 1,
          tabText: "油品促销",
          money: 0,
        },
        {
          key: 2,
          tabText: "商城",
          money: 0,
        }
      ],
      pageInfo: {
        page: 0,
        rows: 10,
      },
      dataList: []
    };
  },
  mounted() {
    for (let i = 0; i < 11; i++) {
      this.columns.push(moment().subtract(i, 'y').format('YYYY'))
    }
    this.queryDiscountMoney();
    this.queryDiscountDetail();
  },
  methods: {
    // 优惠金额
    queryDiscountMoney() {
      this.$Loading.open();
      this.$http.post('/app/json/save_money_record/discountAmount', {
        year: this.queryYear
      }).then(res => {
        let data = res.data;
        if (data.status == 0) {
          this.yearSaveMoney = data.data.totalAmount || 0;
          this.tabData[0].money = data.data.oilAmount || 0;
          this.tabData[1].money = data.data.shopAmount || 0;
        } else {
          this.$Toast(data.info);
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(`discountAmount err ${err}`);
        this.$Loading.close();
      })
    },
    // 优惠明细
    queryDiscountDetail() {
      this.$Loading.open();
      this.pageInfo.page++;
      let params = new FormData();
      let paramsData = {
        token: this.$store.state.login.token,
        year: this.queryYear,
        type: this.tabIndex == 0 ? 1 : 2, // 1 加油 2 商城
      }
      params.append('page', this.pageInfo.page);
      params.append('rows', this.pageInfo.rows);
      params.append('jsonData', JSON.stringify(paramsData));

      this.$http.post('/app/jqGrid/save_money_record/savingDetails', params).then(res => {
        let data = res.data;
        if (data.status == 0) {
          if (data.data instanceof Array) {
            this.dataList.push(...data.data);
            if (data.records <= this.dataList.length) {
              this.hasMore = false;
            }
          }
        } else {
          this.$Toast(data.info);
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(`discountAmount err ${err}`);
        this.$Loading.close();
      })
    },
    changeTabHandler(item, index) {
      this.tabIndex = index;
      
      this.pageInfo.page = 0;
      this.dataList = [];
      this.queryDiscountDetail();
      this.hasMore = true;
    },
    onCancel() {
      this.showPicker = false;
    },
    onConfirm(value) {
      this.queryYear = value;
      this.showPicker = false;
      this.queryDiscountMoney();

      this.pageInfo.page = 0;
      this.dataList = [];
      this.queryDiscountDetail();
      this.hasMore = true;
    }
  }
};
</script>
<style lang='stylus' scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.no-result {
  font-size 14px;
  text-align center;
  color #ccc;
  padding-top 50px;
}

// 顶部标题背景
.top-tip {
  .leaderboard-bg {
    display: block;
    width: 100%;
  }

  .change-time-btn {
    position: absolute;
    left: 50%;
    top: 25px;
    transform: translateX(-50%);
    width: 90px;
    height: 26px;
    line-height: 26px;
    background-color: rgba(255 255 255 0.3);
    color: #fff;
    text-align: center;
    font-size: 14px;
    border-radius: 13px;
  }

  .top-price {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    position: absolute;
    left: 0;
    right: 0;
    top: 65px;
    z-index: 1;
    text-align: center;
  }
}

// tab切换
.tab-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: flex-end;
  position: relative;
  z-index: 10;
  margin-top: -32px;
  height: 65px;

  .tab-btn {
    width: 47%;
    height: 60px;
    border-radius: 5px;
    background: linear-gradient(to top right, #fed3a2, #c6b382);
    text-align: center;
    color: #000;
    font-size: 14px;
    font-weight: 700;
    position: relative;
    box-shadow: 0 0 5px #ddd;
    transition: height 0.2s;

    .tab-text-c {
      display: flex;
      justify-content: center;
      width: 100%;
      height: 60px;
      flex-direction: column;
      position: absolute;
      left: 0;
      bottom: 0;

      .name {
        margin-bottom: 3px;
      }

      .price {
        font-size: 17px;
        font-weight: 700;
        margin-top: 3px;
      }
    }

    &.active {
      height: 65px;
      background: #fff;
      color: #7e5714;
    }
  }
}

// 列表数据
.scroll-container {
  position absolute;
  left 0
  right 0;
  bottom 0;
  top 190px;
}
.data-list {
  padding 0 10px;
  .scroll-c {
    padding-top 10px;
  }
  .item {
    padding: 10px;
    border-radius 4px;
    box-shadow 0 0 5px #ddd;
    margin-top 10px;
    &:first-child {
      margin-top 0;
    }
    .title {
      font-size 15px;
      font-weight 700;
    }
    .text {
      margin-top 8px;
      font-size 13px;
      color #686868;
    }
  }
}
</style>