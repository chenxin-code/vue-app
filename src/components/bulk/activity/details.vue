<template>
  <div class="body">
    <nav-top
      bstyle="transparent"
      @backEvent="$router.go(-1)"
      title="活动详情"
    ></nav-top>
    <nav-content>
      <div class="btn-from" @click="navToDetail">本团订单</div>
      <div class="listBox">
        <div class="groupbuyActivityName">{{ groupbuyActivityName }}</div>
        <div class="endTime">
          <span></span>
          {{ groupData.endTime }}
        </div>
        <div class="goodsTotal">
          <span></span>
          {{ skuList.length }}件商品
        </div>
        <div class="line"></div>
        <div class="listColumn" v-for="(item, index) in skuList" :key="index">
          <div class="leftBox">
            <img :src="item.skuPictureUrl.split(',')[0]" alt="" />
          </div>
          <div class="rightBox">
            <p class="title">{{ item.skuName }}</p>
            <p class="price">￥{{ item.headPrice }}</p>
            <p class="salePrice">销售价：￥{{ item.sellPrice }}</p>
            <!-- <p class="quantity">
              <span>剩余数量：{{ item.surplusNumber }}</span>
              <span>开团最低销量：{{ item.minGroupNumber }}</span>
            </p> -->
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
            <div class="rule_item">
              <div class="rule_title">本团最低成团限制</div>
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
      groupbuyActivityName: "",
    };
  },
  created() {
    this.activityNo = JSON.parse(this.$route.query.activityNo);
    this.groupbuyActivityName = JSON.parse(
      this.$route.query.groupbuyActivityName
    );
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
    navToDetail(id) {
      //本团订单
      this.$router.push({
        path: "/groupOrder",
        query: {
          id: JSON.stringify(this.activityNo),
        },
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

    .btn-from {
      display: flex;
      justify-content: flex-end;
      padding: 0 10px;
      font-size: 15px;
      font-weight: 600;
      color: #FFF;
    }
  }

  .listBox {
    background-color: #fff;
    margin: 12px;
    padding: 22px 18px 18px;
    background: #FFFFFF;
    border-radius: 12px;

    .groupbuyActivityName {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #333333;
      line-height: 16px;
    }

    .endTime {
      font-size: 13px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 16px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 16px 0 12px;

      span {
        width: 5px;
        height: 5px;
        background: #E9306D;
        border-radius: 50%;
        margin-right: 8px;
      }
    }

    .goodsTotal {
      font-size: 13px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 16px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      span {
        width: 5px;
        height: 5px;
        background: #E9306D;
        border-radius: 50%;
        margin-right: 8px;
      }
    }

    .line {
      width: 320px;
      height: 1px;
      background: #F0F0F0;
      margin: 0 auto;
      margin: 17px 0 0;
    }

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
    position: relative;
    padding: 17px 0 17px;
    display: flex;

    .leftBox {
      margin-right: 15px;

      img {
        width: 70px;
        height: 70px;
        object-fit: cover;
      }
    }

    .rightBox {
      .title {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;
        line-height: 16px;
      }

      .price {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: bold;
        text-decoration: line-through;
        color: #999999;
        line-height: 15px;
        margin: 11px 0 9px;
      }

      .salePrice {
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #F00000;
        line-height: 15px;
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
    margin: 0 12px;
    overflow: hidden;
    background: #FFFFFF;
    border-radius: 12px;
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
