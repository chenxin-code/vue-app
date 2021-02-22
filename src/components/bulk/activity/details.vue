<template>
  <div class="body">
    <nav-top
      bstyle="transparent"
      @backEvent="$router.go(-1)"
      title="活动详情"
    ></nav-top>
    <nav-content>
      <div class="listBox">
        <div class="listColumn">
          <div class="leftBox">
            <img src="static/image/microShop/lvyou.png" alt="" />
          </div>
          <div class="rightBox">
            <p class="title">服装店展示架复古个性吊架悬挂 衣架铁艺</p>
            <p class="price">￥2999.00</p>
            <p class="salePrice">销售价：￥9999.99</p>
            <p class="quantity">
              <span>剩余数量：1000</span>
              <span>开团最低销量：100</span>
            </p>
          </div>
        </div>
        <div class="listColumn">
          <div class="leftBox">
            <img src="static/image/microShop/lvyou.png" alt="" />
          </div>
          <div class="rightBox">
            <p class="title">服装店展示架复古个性吊架悬挂 衣架铁艺</p>
            <p class="price">￥2999.00</p>
            <p class="salePrice">销售价：￥9999.99</p>
            <p class="quantity">
              <span>剩余数量：1000</span>
              <span>开团最低销量：100</span>
            </p>
          </div>
        </div>
      </div>
      <van-collapse v-model="activeNames" class="collapse">
        <van-collapse-item title="拼团规则">
          <div class="ruleBox">
            <div class="ruleNum">
              <p><span>活动参与总人数</span>100</p>
              <p><span>活销售总金额</span>100</p>
            </div>
            <div class="ruleNum">
              <p><span>活动总单数</span>100</p>
              <p><span>本团总单数</span>100</p>
            </div>
            <div class="ruleNum">
              <p><span>本团总销售金额</span>100</p>
              <p><span>本团参与总人数</span>100</p>
            </div>
            <div class="ruleNum">
              <p><span>开团最低销量</span>100</p>
              <p><span>开团最低销售</span>1000</p>
            </div>
            <div class="ruleNum ruleTime">
              <p><span>活动开始时间</span>2021/10/10 20:00:00</p>
            </div>
            <div class="ruleNum">
              <p><span>活动结束时间</span>2021/10/11 20:00:00</p>
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
    };
  },
  mounted() {},
  methods: {},
  created() {},
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.body {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #f6f6f6 !important;
  background-image: url('./images/bg.png');
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: top;

  .listBox {
    background-color: #fff;
    margin: 15px 10px;
    padding: 10px;
    border-radius: 15px 15px 0 0;
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
        margin: 0 5px;

        span {
          flex: 1;
          width: 105px;
          display: inline-block;
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
