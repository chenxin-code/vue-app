<template>
  <div class="body">
    <nav-top
      bstyle="transparent"
      @backEvent="$router.go(-1)"
      title="活动详情"
    ></nav-top>
    <nav-content>
      <div class="listBox">
        <div
          class="listColumn"
          v-for="(item, index) in skuList"
          :key="index"
          @click="navToDeatil(item)"
        >
          <div class="leftBox">
            <img :src="item.skuPictureUrl" alt="" />
          </div>
          <div class="rightBox">
            <p class="title">{{ item.skuName }}</p>
            <p class="price">￥{{ item.headPrice }}</p>
            <p class="salePrice">销售价：￥{{ item.sellPrice }}</p>
            <p class="quantity">
              <span>剩余数量：{{ item.surplusNumber }}</span>
              <span>开团最低销量：{{ item.minGroupNumber }}</span>
            </p>
          </div>
        </div>
        <div class="show_more" v-show="isShowMore" @click="showMore">
          查看更多
        </div>
      </div>
      <van-collapse v-model="activeNames" class="collapse">
        <van-collapse-item title="拼团规则">
          <div class="ruleBox">
            <div class="rule_item">
              <div class="rule_title">活动时间</div>
              <div class="rule_time">
                <div>{{ groupData.startTime }}</div>
                <div>至</div>
                <div>{{ groupData.endTime }}</div>
              </div>
            </div>
            <div class="rule_item">
              <div class="rule_title">活动最低成团限制</div>
              <div class="rule_detail">
                <div class="rule_detail_item">
                  <div class="rule_detail_item_box">
                    <div>最低参团人数</div>
                    <div>{{ groupData.minTotalPeopleNumber }}</div>
                  </div>
                  <div class="rule_detail_item_box">
                    <div>最低订单数量</div>
                    <div>{{ groupData.minTotalOrderNumber }}</div>
                  </div>
                </div>
                <div class="rule_detail_item">
                  <div class="rule_detail_item_box">
                    <div>最低销售金额</div>
                    <div>{{ groupData.minTotalSaleAmount }}</div>
                  </div>
                  <div class="rule_detail_item_box">
                    <div>最低商品销售数量</div>
                    <div>{{ groupData.minTotalSkuNumber }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="rule_item">
              <div class="rule_title">本团最低成团限制</div>
              <div class="rule_detail">
                <div class="rule_detail_item">
                  <div class="rule_detail_item_box">
                    <div>最低参团人数</div>
                    <div>{{ groupData.allMinTotalPeopleNumber }}</div>
                  </div>
                  <div class="rule_detail_item_box">
                    <div>最低订单数量</div>
                    <div>{{ groupData.allMinTotalOrderNumber }}</div>
                  </div>
                </div>
                <div class="rule_detail_item">
                  <div class="rule_detail_item_box">
                    <div>最低销售金额</div>
                    <div>{{ groupData.allMinTotalSaleAmount }}</div>
                  </div>
                  <div class="rule_detail_item_box">
                    <div>最低商品销售数量</div>
                    <div>{{ groupData.allMinTotalSkuNumber }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </nav-content>
  </div>
</template>

<script>
export default {
  name: "activityDetail",
  // mixins: [api],
  data() {
    return {
      activeNames: ["1"],
      activityNo: "",
      goodsList: [],
      skuList: [],
      isShowMore: false,
      groupData: {},
    };
  },
  created() {
    this.activityNo = JSON.parse(this.$route.query.activityNo);
    this.$http
      .post("/app/json/groupbuying_activity_app/getById", {
        id: this.activityNo,
      })
      .then((res) => {
        if (res.data.result == "success") {
          this.groupData = res.data.data;
          this.goodsList = this.groupData.skuInfos;
          if (this.goodsList.length > 3) {
            this.isShowMore = true;
            for (let index = 0; index < 3; index++) {
              this.skuList.push(this.goodsList[index]);
            }
          } else {
            this.skuList = this.goodsList;
          }
        }
      });
  },
  mounted() {},
  methods: {
    showMore() {
      this.isShowMore = false;
      this.skuList = this.goodsList;
    },
    navToDeatil(item) {
      this.$router.push({
        path: "/bulk_goods_deatil",
      });
    },
  },
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.body {
  width: 100%;
  height: 100%;
  background-color: #f6f6f6 !important;
  background-image: url('./images/bg.png');
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: top;
  overflow-y: scroll;

  .nav-content {
    overflow-y: scroll;
    padding-bottom: 79px;
  }

  .listBox {
    background-color: #fff;
    margin: 15px 10px;
    padding: 10px;
    border-radius: 15px 15px 0 0;

    .show_more {
      width: 100%;
      height: 29px;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #999999;
    }
  }

  .listColumn {
    &:after {
      content: ' ';
      box-sizing: border-box;
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid $color-line-gray-l;
      color: $color-line-gray-l;
      transform-origin: 0 0;
      transform: scaleY(0.5);
      z-index: 2;
    }

    &:last-child:after {
      content: none;
    }

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
    }

    position: relative;
    padding: 10px 0;
    display: flex;

    .leftBox {
      margin-right: 10px;

      img {
        width: 110px;
        height: 110px;
      }
    }

    .rightBox {
      .title {
        color: #3C3F43;
        font-size: 15px;
        font-weight: bold;
        line-height: 20px;
      }

      .price {
        margin: 8px 0;
        color: #E0483F;
        font-size: 18px;
        font-weight: bold;
      }

      .salePrice {
        color: #999999;
        font-size: 14px;
        margin-bottom: 8px;
      }

      .quantity {
        color: #C1C0C0;

        span {
          margin-right: 10px;
        }
      }
    }
  }

  .collapse {
    border-radius: 10px;
    margin: 0 10px;
    overflow: hidden;
  }

  /deep/.van-collapse-item__content {
    padding-top: 0px;
  }

  .ruleBox {
    margin: 0px 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    color: #666666;

    .rule_item {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      margin-bottom: 10px;

      .rule_title {
        font-size: 14px;
        font-weight: 700;
      }

      .rule_time {
        font-size: 12px;
        font-weight: 600px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 8px;

        div {
          margin-left: 4px;
        }
      }

      .rule_detail {
        display: flex;
        justify-content: space-between;

        .rule_detail_item {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;

          .rule_detail_item_box {
            min-width: 150px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-top: 8px;

            div {
              margin-right: 5px;
              font-size: 12px;
              font-weight: 600px;
            }
          }
        }
      }
    }
  }

  /deep/ .van-cell {
    &:after {
      content: none;
    }

    .van-cell__title {
      span {
        font-weight: bold;
        font-size: 16px;
        color: #666666;
      }
    }
  }
}
</style>
