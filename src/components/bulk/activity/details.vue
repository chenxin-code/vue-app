<template>
  <div class="body">
    <nav-top
      bstyle="transparent"
      @backEvent="$router.go(-1)"
      title="活动详情"
    ></nav-top>
    <nav-content>
      <div class="listBox">
        <div class="listColumn" v-for="(item, index) in skuList" :key="index">
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
            <div class="ruleNum">
              <p>
                <span>活动总订单数</span>{{ groupData.minTotalOrderNumber }}
              </p>
              <p>
                <span>活动销售总金额</span>{{ groupData.minTotalSaleAmount }}
              </p>
            </div>
            <div class="ruleNum">
              <p>
                <span>活动参与总人数</span>{{ groupData.minTotalPeopleNumber }}
              </p>
              <p>
                <span>活动商品总件数</span>{{ groupData.minTotalSkuNumber }}
              </p>
            </div>
            <div class="ruleNum ruleTime">
              <p><span>活动开始时间</span>{{ groupData.startTime }}</p>
            </div>
            <div class="ruleNum">
              <p><span>活动结束时间</span>{{ groupData.endTime }}</p>
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

  .ruleBox {
    margin: 15px 5px;

    .ruleNum {
      display: flex;

      p {
        flex: 1;

        span {
          flex: 1;
          margin: 0 5px;
        }
      }
    }

    .ruleTime {
      margin-top: 20px;
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
