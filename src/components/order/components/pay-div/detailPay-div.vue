<template>
  <div class="pay-content">
    <div class="pay-div">
      <div>
        <div class="pay-box" v-show="isShow">
          <van-checkbox
            v-model="isChecked"
            checked-color="#E5165A"
            @click="checkEvent($event)"
            icon-size="18px"
          ></van-checkbox>
          <div class="text">
            <p class="p1">全选</p>
            <div class="checkAll">
              <div class="all">
                合计<span
                  >￥<span>{{ amount.integer }}</span
                  >.<span class="decimal">{{ amount.decimal }}</span></span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pay">
        <div class="btn" @click="mergePay">
          <div class="text">去结算</div>
          <div class="total">({{ total }})</div>
        </div>
      </div>
    </div>
    <!-- <div class="adapter-iphoneX" v-if="this.$util.getIsIphoneX_X()"></div> -->
  </div>
</template>

<script>
export default {
  props: ["checkData", "mergeAmount", "total", "resultList"],
  data() {
    return {
      isChecked: false,
      isShow: false,
      amount: {
        integer: "0",
        decimal: "00"
      }
    };
  },
  created() {},

  methods: {
    checkEvent(event) {
      let arr = Array.from(this.checkData);
      console.log(`paydiv`, arr);
      console.log(`resultList`, this.resultList);

      if (arr.length == 0) return;
      // let data = {};
      // data.checked = this.isChecked;
      // data.checkAll = true;

      // let data = {};
      this.resultList.checked = this.isChecked;
      this.resultList.checkAll = true;

      this.$emit("checkEvent", this.resultList);
    },
    mergePay() {
      this.$emit("mergePay");
    }
  },
  watch: {
    mergeAmount: function(newVal, oldVal) {
      let totalPrice = this.$util.toDecimal2(newVal);
      let totalArr = totalPrice.toString().split(".");
      this.amount.integer = totalArr[0];
      this.amount.decimal = totalArr[1];
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
$color = #E5165A;
.pay-content{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  .adapter-iphoneX{
    width: 100%;
    height: 20px;
    background-color: #fff;
  }
}
.pay-div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 75px;
  background: #fff;
  padding: 0 23.375px ;
  box-shadow: 0px -3px 10px 0px #F1F1F1;

  .pr {
    display: flex;
    font-size: 16px;
    font-family: SourceHanSansCN-Normal, SourceHanSansCN;
    font-weight: 400;
    line-height: 52px;
    white-space: nowrap;

    &.pos {
      position: absolute;
      left: 70px;
      top: -10px;
      font-size: 16px;
    }

    p {
      color: #2C2C2C;
    }

    span {
      color: #FD3A3A;
    }
  }

  .pay-box {
    display: flex;

    .text {
      display: flex;
      align-items :center;
      p {
        padding-left: 4px;
      }

      .p1 {
        font-size: 14px;
        font-family: SourceHanSansCN-Normal, SourceHanSansCN;
        font-weight: 400;
        color: #121212;
        // line-height: 16px;
      }

      .p2 {
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 16px;
        white-space: nowrap;
      }

      .checkAll{
        margin-left: 10px;

        .all{
          font-size: 14px;
          font-family: SourceHanSansCN-Normal, SourceHanSansCN;
          font-weight: 400;
          color: #121212;

          span {
            font-size: 16px;
            font-family: SourceHanSansCN-Medium, SourceHanSansCN;
            font-weight: 500;
            color: $color;
            line-height: 16px;
          }
          .decimal{
            font-size: 12px;
          }
        }

        .onlyCheck{
          font-size: 10px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #8D8D8D;
          line-height: 16px;
        }
      }
    }
  }

  .pay {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .pr {
      display: flex;
      font-size: 16px;
      font-family: SourceHanSansCN-Normal, SourceHanSansCN;
      font-weight: 400;
      line-height: 52px;
      white-space: nowrap;

      p {
        color: #2C2C2C;
      }

      span {
        color: #FD3A3A;
      }
    }

    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 104px;
      height: 40px;
      text-align: center;
      line-height: 45px;
      background: linear-gradient(90deg, #E5165A 0%, #FF6094 100%);
      border-radius: 20px;
      margin-left: 6px;

      div{
        font-weight: 500;
        color: #FFFFFF;
        font-size: 15px;
        position: relative;
        top: 0px;
      }
      .total{
        top :-1px;
      }
    }
  }
}
</style>
