<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <van-search
        v-model="params.skuName"
        shape="round"
        input-align="center"
        class="reset-search"
        placeholder="请输入搜索关键词"
        @search="searchHandler"
        @clear="clearHandler"
      />
      <div class="tab-container">
        <div
          class="btn"
          :class="{active: activeIndex == index}"
          v-for="(item, index) in tabs"
          @click="tabClick(index)"
          :key="index"
        >{{ item }}</div>
      </div>
      <ul class="auction-product-list" v-if="prodList.length > 0">
        <li class="auction-item" v-for="(item, index) in prodList" :key="index" @click="prodocuClick(item)">
          <div class="top">
            <img :src="item.pic" alt class="prod-img" />
            <div class="countdown">
              {{ activeIndex == 0 ? '距离结束：' : '距离开始：' }}
              <van-count-down class="reset-countdown" :time="item.endDownTime" v-if="activeIndex == 0"/>
              <van-count-down class="reset-countdown" :time="item.startDownTime" v-else/>
            </div>
          </div>
          <div class="mid">
            <p class="prod-name van-multi-ellipsis--l2">{{ item.skuName }}</p>
          </div>
          <div class="btm">
            <div class="price">
              当前价:
              <p class="price-c">
                ￥
                <span class="price-num">{{ item.onSalePrice }}</span>
              </p>
            </div>
            <div class="state">{{ activeIndex == 0 ? '进行中' : '预展中' }}</div>
          </div>
        </li>
      </ul>
      <p class="no-result-message" v-else>暂无数据~</p>
    </nav-content>
  </div>
</template>
<script>
import { CountDown } from "vant";
import moment from 'moment';
export default {
  data() {
    return {
      tabs: ["进行中", "预展中"],
      activeIndex: 0,
      params: {
        skuName: ""
      },
      prodList: []
    };
  },
  components: {
    // "van-count-down": CountDown
    [CountDown.name]: CountDown
  },
  mounted() {
    this.initList();
  },
  methods: {
    // 初始化列表
    initList(stateType = 2, skuName) {
      this.$Loading.open();
      let params = {
        stateType // 2 进行中 1 预展中
      };
      if (skuName) {
        params = {
          stateType,
          skuName
        }
      }
      this.$http.post('/app/json/app_product_auction/getProductAuctionList', params).then(res => {
        let data = res.data;
        if (data.status == 0) {
          data.data.forEach(item => {
            if (item.startTime) {
              item.startDownTime = moment(item.startTime).diff(moment(this.$store.state.severTime.currentTime * 1000));
            }
            if (item.endTime) {
              item.endDownTime = moment(item.endTime).diff(moment(this.$store.state.severTime.currentTime * 1000));
            }
          })
          this.prodList = data.data;
        } else {
          this.$Toast(data.info);
        }
        this.$Loading.close();
      }).catch(err => {
        this.$Toast(err)
        this.$Loading.close();
      })
    },
    // tab切换点击
    tabClick(index) {
      if (this.activeIndex == index) {
        return false;
      }
      this.activeIndex = index; // 0 进行中 1 预展中
      this.prodList = [];
      this.params.skuName = '';
      if (index == 0) {
        this.initList();
      } else {
        this.initList(1);
      }
    },
    // 商品列表点击
    prodocuClick(item) {
      this.$router.push({
        path: '/auction_order_detail/' + this.$util.getDataString(),
        query: {
          id: item.skuSaleId,
          skuId: item.skuId,
          lastPath: '/auction_session',
          productType: 1,
          auctionActivityId: item.id,
        }
      })
    },
    // 确定搜索
    searchHandler(skuName) {
      if (this.activeIndex == 0) {
        this.initList(2, skuName)
      } else {
        this.initList(1, skuName)
      }
    },
    // 清楚搜索
    clearHandler() {
      if (this.activeIndex == 0) {
        this.initList()
      } else {
        this.initList(1)
      }
    }
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.container {
  .reset-search {
    padding-top: 0;
  }

  .reset-countdown {
    display: inline-block;
    font-size: 13px;
    color: #fff;
  }

  .tab-container {
    margin: 0 12px;
    background-color: #fee8e9;
    height: 30px;
    line-height: 30px;
    border-radius: 25px;
    text-align: center;
    color: #f73546;
    font-size: 14px;
    display: flex;

    .btn {
      flex-grow: 1;

      &.active {
        background-color: $color-theme-r;
        border-radius: 25px;
        color: #fff;
      }
    }
  }

  .auction-product-list {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 85px;
    overflow-y: auto;
    padding: 0 12px 10px;
    // display: flex;
    // flex-wrap: wrap;
    // justify-content: space-between;
    // align-content: flex-start;

    .auction-item {
      width: 49%;
      border-radius: 5px;
      box-shadow: 0 0 5px #ddd;
      margin-top: 5px;
      &:nth-child(2n) {
        float right;
      }
      &:nth-child(2n+1) {
        float left;
      }

      .top {
        .prod-img {
          display: block;
          width: 73%;
          height: 130px;
          background-color: skyblue;
          margin: 15px auto;
        }

        .countdown {
          height: 25px;
          line-height: 25px;
          background-color: $color-theme-r;
          padding: 0 10px;
          color: #fff;
          font-size: 13px;
          margin-top: -25px;
          position relative;
          z-index 2;
        }
      }

      .mid {
        .prod-name {
          font-size: 15px;
          padding: 10px 8px 0;
          line-height: 17px;
        }
      }

      .btm {
        padding: 8px;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        font-size: 12px;

        .price {
          color: $color-text-d;

          .price-c {
            color: $color-theme-r;
            display: inline-block;
            font-weight: 700;

            .price-num {
              font-weight: 700;
              font-size: 19px;
            }
          }
        }

        .state {
          color: $color-theme-r;
        }
      }
    }
  }

  .no-result-message {
    text-align center;
    color $color-text-d;
    padding 50px 0;
  }
}
</style>